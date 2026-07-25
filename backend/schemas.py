from typing import Any, Optional
from pydantic import BaseModel
from datetime import datetime

class UserResponse(BaseModel):
    role: str | None
    username: str
    avatar_url: str | None
    bio: str | None
    created_at: datetime
    binding_option: int
    max_posts: int
    num_posts: int

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

class UserProfileResponse(BaseModel):
    role: str | None
    username: str
    avatar_url: str | None
    bio: str | None
    top_piece_number: int
    top_score: int
    last_sign_in_at: datetime
    created_at: datetime
    
class RecordCreate(BaseModel):
    position: int
    record: Any

class PostCreate(BaseModel):
    title: str 
    description: str
    record1: Optional[str] = None
    record2: Optional[str] = None
    created_at: Optional[datetime] = None

class CommentCreate(BaseModel):
    content: str
    created_at: Optional[datetime] = None