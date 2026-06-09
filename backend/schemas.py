from pydantic import BaseModel
from datetime import datetime

class RegisterRequest(BaseModel):
    username: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterResponseModel(BaseModel):
    message: str
    id: int
    username: str
    password: str
    created_at: datetime

class LoginResponseModel(BaseModel):
    message: str
    id: int
    username: str
    password: str
    created_at: datetime