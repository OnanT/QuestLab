from pydantic import BaseModel
from typing import Optional

class TypingResultSchema(BaseModel):
    game_id: int
    input_text: str
    target: str
    time_ms: int

class TypingResultResponse(BaseModel):
    accuracy: float
    wpm: float
    errors: int
    passed: bool
    shells_awarded: int
