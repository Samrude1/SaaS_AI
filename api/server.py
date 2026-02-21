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

# Note: Both Google and OpenAI models are now served via OpenRouter
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

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
    "google/gemini-2.5-flash": "Gemini 2.5 Flash",
    "anthropic/claude-3.5-sonnet": "Claude 3.5 Sonnet",
    "openai/gpt-4o": "GPT-4o",
    "meta-llama/llama-3.3-70b-instruct": "Llama 3.3 70B",
    "deepseek/deepseek-r1": "DeepSeek R1 (Thinking)"
}

system_prompt = """You are an expert meeting facilitator and business analyst.
Your task is to transform raw meeting notes into clear, structured, actionable output.

IMPORTANT: You MUST reply in the exact same language that the notes are written in. If the notes are in English, reply in English. If the notes are in Finnish, reply in Finnish. Never reply in German unless the notes are in German. If the language is too short or ambiguous, default to English.

Reply with exactly four sections using these headings (translated to the target language):

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
    model: str = "google/gemini-2.5-flash"

def user_prompt_for(meeting: Meeting) -> str:
    return f"""Please process these meeting notes:

Meeting Topic: {meeting.topic}
Date: {meeting.meeting_date}

Raw Notes:
{meeting.notes}"""


# ------------- Streaming helpers -------------

def stream_openrouter(meeting: Meeting):
    from openai import OpenAI
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=OPENROUTER_API_KEY,
    )
    
    stream = client.chat.completions.create(
        model=meeting.model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt_for(meeting)},
        ],
        stream=True,
        # Osa OpenRouterin reasoning-malleista vaatii erillisen parametrin (esim. include_reasoning)
        extra_headers={
            "HTTP-Referer": "https://meetingmind.pro",
            "X-Title": "MeetingMind Pro"
        },
        extra_body={
            "include_reasoning": True
        }
    )
    
    first_thinking = True
    for chunk in stream:
        delta = chunk.choices[0].delta
        
        # Osa SDK/malleista (esim DeepSeek OpenRouterissa) palauttaa 'reasoning' Pydantic-mallin extra-kentissä
        reasoning_text = ""
        
        try:
            print("STREAM DEBUG DELTA:", delta.model_dump())
        except Exception:
            try:
                print("STREAM DEBUG DELTA DICT:", delta.__dict__)
            except Exception:
                pass
        
        if hasattr(delta, 'reasoning_content') and delta.reasoning_content:
            reasoning_text = delta.reasoning_content
        elif getattr(delta, 'model_extra', None) and delta.model_extra.get('reasoning'):
            reasoning_text = delta.model_extra.get('reasoning')

        if reasoning_text:
            # Ilmoitetaan UI:lle että tämä on reasoningia eikä lopullista tekstiä
            yield f"data: {json.dumps({'type': 'thinking', 'content': reasoning_text})}\n\n"
        
        elif delta.content:
            text = delta.content
            # Tavallinen teksti
            yield f"data: {json.dumps({'type': 'text', 'content': text})}\n\n"


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
            if not OPENROUTER_API_KEY:
                yield "data: Error: OPENROUTER_API_KEY is missing.\n\n"
                return

            # Kaikki mallit käytetään OpenRouterin kautta samoilla säännöillä
            yield from stream_openrouter(meeting)

            # --- Observability: Send metadata at the end ---
            elapsed = round(time.time() - start_time, 2)
            model_name = AVAILABLE_MODELS.get(meeting.model, meeting.model)
            yield f"data: {json.dumps({'type': 'text', 'content': chr(10) + chr(10)})}\n\n"
            yield f"data: {json.dumps({'type': 'text', 'content': '---'})}\n\n"
            yield f"data: {json.dumps({'type': 'text', 'content': chr(10) + chr(10) + f'⏱ **{model_name}** completed the task in **{elapsed}s**'})}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'content': str(e)})}\n\n"

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
