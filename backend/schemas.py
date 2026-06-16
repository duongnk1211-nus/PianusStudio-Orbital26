from pydantic import BaseModel
from datetime import datetime

class RegisterRequest(BaseModel):
    email: str
    username: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterResponse(BaseModel):
    message: str
    id: int
    email: str
    username: str
    password: str
    created_at: datetime

class LoginResponse(BaseModel):
    message: str
    email: str
    access_token: str

class LogoutResponse(BaseModel):
    message: str

class UserInfo(BaseModel):
    message: str
    email: str
    username: str
    created_at: datetime