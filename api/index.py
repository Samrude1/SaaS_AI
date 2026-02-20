import os
import traceback
from fastapi import FastAPI, Depends  # type: ignore
from fastapi.responses import StreamingResponse  # type: ignore
from pydantic import BaseModel  # type: ignore
from fastapi_clerk_auth import ClerkConfig, ClerkHTTPBearer, HTTPAuthorizationCredentials  # type: ignore
import google.generativeai as genai  # type: ignore
from dotenv import load_dotenv

load_dotenv()

# Konfiguroidaan Gemini
api_key = os.getenv("GOOGLE_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

app = FastAPI()

# Clerk configuration
clerk_config = ClerkConfig(jwks_url=os.getenv("CLERK_JWKS_URL"))
clerk_guard = ClerkHTTPBearer(clerk_config)

class Visit(BaseModel):
    patient_name: str
    date_of_visit: str
    notes: str

system_prompt = """
You are a highly professional Healthcare Consultation Assistant.
Your task is to take doctor's visit notes and transform them into structured medical documentation.

Reply in Finnish (suomeksi) with exactly three sections using these headings:
### 📋 Yhteenveto lääkärille
(Professional medical summary for the doctor's records)

### 🚀 Seuraavat askeleet (Jatkotoimenpiteet)
(Clear actionable items for the doctor)

### 📧 Luonnos potilassähköpostiksi
(A warm, patient-friendly email summary of the visit)

Use crisp markdown formatting and professional tone.
"""

def user_prompt_for(visit: Visit) -> str:
    return f"""Luo yhteenveto, jatkotoimenpiteet ja sähköpostiluonnos seuraaville tiedoille:
Potilaan nimi: {visit.patient_name}
Vastaanottopäivä: {visit.date_of_visit}
Muistiinpanot:
{visit.notes}"""

@app.post("/api")
async def consultation_summary(
    visit: Visit,
    creds: HTTPAuthorizationCredentials = Depends(clerk_guard)
):
    user_id = creds.decoded["sub"]
    
    # Gemini 2.5 Flash-Lite on optimaalinen helmikuussa 2026 (korkeimmat ilmaisrajat)
    model_name = "gemini-2.5-flash-lite"


    
    def event_stream():
        try:
            if not api_key:
                yield "data: Virhe: GOOGLE_API_KEY puuttuu.\n\n"
                return

            model = genai.GenerativeModel(
                model_name,
                system_instruction=system_prompt
            )
            
            user_prompt = user_prompt_for(visit)
            response = model.generate_content(user_prompt, stream=True)

            for chunk in response:
                try:
                    if chunk.text:
                        text = chunk.text
                        lines = text.split("\n")
                        for line in lines[:-1]:
                            yield f"data: {line}\n\n"
                            yield "data:  \n"
                        yield f"data: {lines[-1]}\n\n"
                except Exception as e:
                    continue
                    
        except Exception as e:
            error_msg = str(e)
            yield f"data: Virhe kutsuttaessa mallia {model_name}: {error_msg}\n\n"

    return StreamingResponse(
        event_stream(), 
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
