import os
import time
import json
from pathlib import Path
from fastapi import FastAPI, Depends
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi_clerk_auth import ClerkConfig, ClerkHTTPBearer, HTTPAuthorizationCredentials
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
api_key = os.getenv("GOOGLE_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

app = FastAPI(title="MeetingMind Pro API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

jwks_url = os.getenv("CLERK_JWKS_URL")
if not jwks_url:
    print("CRITICAL: CLERK_JWKS_URL is missing from environment!")
else:
    print(f"DEBUG: Using CLERK_JWKS_URL: {jwks_url[:30]}...")

clerk_config = ClerkConfig(jwks_url=jwks_url)
clerk_guard = ClerkHTTPBearer(clerk_config)

# ------------- Models & Prompts -------------

AVAILABLE_MODELS = {
    "gemini-2.5-flash-lite": "Gemini 2.5 Flash-Lite",
    "gpt-4o-mini":           "GPT-4o Mini",
}

system_prompt = """You are an expert meeting facilitator and business analyst.
Your task is to transform raw meeting notes into clear, structured, actionable output.

Reply with exactly four sections using these headings (in the language the notes are written in):

### ✅ Key Decisions
List the concrete decisions made during the meeting as bullet points.

### 🎯 Action Items
A table with columns: Task | Owner | Deadline. If no owner/deadline is mentioned, write "TBD".

### 📣 Slack Summary
A concise, ready-to-paste Slack message (max 4 bullet points). Start with a one-line headline.

### 📧 Follow-up Email Draft
A professional follow-up email to send to all participants. Include subject line.

Use crisp markdown formatting. Be specific and actionable, not vague.
"""

class Meeting(BaseModel):
    topic: str
    meeting_date: str
    notes: str
    model: str = "gemini-2.5-flash-lite"

def user_prompt_for(meeting: Meeting) -> str:
    return f"""Please process these meeting notes:

Meeting Topic: {meeting.topic}
Date: {meeting.meeting_date}

Raw Notes:
{meeting.notes}"""


# ------------- Streaming helpers -------------

def stream_gemini(meeting: Meeting):
    model = genai.GenerativeModel(
        meeting.model,
        system_instruction=system_prompt
    )
    response = model.generate_content(user_prompt_for(meeting), stream=True)
    for chunk in response:
        try:
            if chunk.text:
                yield f"data: {json.dumps(chunk.text)}\n\n"
        except Exception:
            continue


def stream_openai(meeting: Meeting):
    from openai import OpenAI
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    stream = client.chat.completions.create(
        model=meeting.model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt_for(meeting)},
        ],
        stream=True,
    )
    for chunk in stream:
        text = chunk.choices[0].delta.content
        if text:
            yield f"data: {json.dumps(text)}\n\n"


# ------------- API Endpoints -------------

from fastapi import Request, HTTPException
import jwt

@app.post("/api/consultation")
async def meeting_summary(
    request: Request,
    meeting: Meeting,
):
    start_time = time.time()
    
    # ------------------ CLERK AUTH ------------------
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        try:
            creds = await clerk_guard(request)
        except Exception as e:
            # Salli JWT-ohitus vain lokaalissa kehityksessä, jos erikseen määritetty
            if os.getenv("ENVIRONMENT") == "development":
                print(f"DEV WARNING: Ohitetaan auth-virhe: {e}")
                pass
            else:
                raise HTTPException(status_code=401, detail=f"Invalid or missing authentication token: {e}")
    # ----------------------------------------------------

    def event_stream():
        try:
            if meeting.model.startswith("gemini"):
                if not api_key:
                    yield "data: Error: GOOGLE_API_KEY is missing.\n\n"
                    return
                yield from stream_gemini(meeting)

            elif meeting.model.startswith("gpt"):
                if not os.getenv("OPENAI_API_KEY"):
                    yield "data: Error: OPENAI_API_KEY is missing.\n\n"
                    return
                yield from stream_openai(meeting)

            else:
                yield f"data: Error: Unknown model '{meeting.model}'.\n\n"
                return

            # Send metadata at the end
            elapsed = round(time.time() - start_time, 2)
            yield f"data: \n\n"
            yield f"data: ---\n\n"
            yield f"data: ⏱ Generated in {elapsed}s · Model: {AVAILABLE_MODELS.get(meeting.model, meeting.model)}\n\n"

        except Exception as e:
            yield f"data: Error: {str(e)}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )


@app.get("/api/models")
def list_models():
    """Returns list of available AI models."""
    return {"models": AVAILABLE_MODELS}


@app.get("/health")
def health_check():
    """Health check for AWS App Runner."""
    return {"status": "healthy"}


# Serve static Next.js files — MUST BE LAST
static_path = Path("static")
if static_path.exists():
    @app.get("/")
    async def serve_root():
        return FileResponse(static_path / "index.html")
    app.mount("/", StaticFiles(directory="static", html=True), name="static")
else:
    @app.get("/")
    async def serve_root_dev():
        return {"message": "No static files found. Run 'npm run build' first."}
