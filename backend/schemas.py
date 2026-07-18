from pydantic import BaseModel
from datetime import datetime

class UserResponse(BaseModel):
    role: str | None
    username: str
    avatar_url: str | None
    bio: str | None
    created_at: datetime
    binding_option: int

class UserScoreResponse(BaseModel):
    user_name: str
    current_score: int
    top_score: int
    changed_at: datetime

class UserScores(BaseModel):
    user_name: str
    piece_number: int
    current_score: int
    top_score: int
    changed_at: datetime

class LeaderboardScoreResponse(BaseModel):
    user_id: str
    user_name: str
    top_score: int