from pydantic import BaseModel
from datetime import datetime

class UserResponse(BaseModel):
    username: str
    avatar_url: str | None
    bio: str | None
    created_at: datetime
