import os
from typing import Literal
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from app.pipeline import format_transcript

app = FastAPI(title="Flow Remake API", version="0.1.0", description="Clean-room dictation API scaffold. ASR is not faked.")
origins = [x.strip() for x in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",") if x.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=False, allow_methods=["GET","POST"], allow_headers=["Content-Type","Authorization"])

class FormatRequest(BaseModel):
    transcript: str = Field(min_length=1, max_length=30000)
    style: Literal["natural", "email", "concise"] = "natural"
    @field_validator("transcript")
    @classmethod
    def not_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("transcript must not be blank")
        return value

class FormatResponse(BaseModel):
    text: str
    style: str
    transformations: list[str]
    review_required: bool = True

@app.get("/health")
def health():
    return {"status":"ok","service":"flow-remake-api","asr":"not-configured"}

@app.post("/v1/format", response_model=FormatResponse)
def format_text(request: FormatRequest):
    try:
        result = format_transcript(request.transcript, request.style)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    return FormatResponse(text=result["text"], style=request.style, transformations=result["transformations"], review_required=True)

@app.post("/v1/transcriptions")
def transcribe_placeholder():
    raise HTTPException(status_code=501, detail="Speech recognition is not configured. Connect and test an ASR provider before enabling this endpoint.")
