from pydantic import BaseModel
from datetime import datetime

class UserResponse(BaseModel):
    role: str | None
    username: str
    avatar_url: str | None
    bio: str | None
    created_at: datetime
