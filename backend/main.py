from fastapi import FastAPI, HTTPException, Header
from database import supabase
from schemas import RegisterRequest, LoginRequest, RegisterResponse, LoginResponse, LogoutResponse, UserInfo
from email_validator import validate_email
import jwt

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/auth/register", response_model=RegisterResponse)
async def register_user(register_request: RegisterRequest):
    try:
        validate_email(register_request.email)
        db_response = supabase.table("users_data").insert({
            "email": register_request.email,
            "username": register_request.username,
            "password": register_request.password,
        }).execute()

        supabase.auth.sign_up({ "email": register_request.email, "password": register_request.password });
        
        user=db_response.data[0]

        return RegisterResponse(
            message="User registered successfully",
            id=user["id"],
            email=user["email"],
            username=user["username"],
            password=user["password"],
            created_at=user["created_at"]
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/auth/login", response_model=LoginResponse)
async def login_user(login_request: LoginRequest):
    try:
        db_response = supabase.table("users_data").select("*").eq("username", login_request.username).execute()

        if not db_response.data:
            raise HTTPException(status_code=404, detail="User not found")
        user = db_response.data[0]
        if user["password"] != login_request.password:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        auth_response = supabase.auth.sign_in_with_password({ "email": user["email"], "password": user["password"] });
        # if not auth_response.email_confirmed_at:
        #     raise HTTPException(status_code=403, detail="Email not verified")

        return LoginResponse(
            message="Login successful",
            email=user["email"],
            access_token=auth_response.session.access_token
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/auth/logout", response_model=LogoutResponse)
async def logout_user(authorization: str = Header(...)):
    try:
        access_token = authorization.replace("Bearer ", "")

        payload = jwt.decode(access_token, options={"verify_signature": False})
        email = payload.get("email")
        supabase.auth.admin.sign_out(access_token)

        return LogoutResponse(
            message="Logout successful",
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/users/me", response_model=UserInfo)
async def get_info(authorization: str = Header(...)):
    try:
        access_token = authorization.replace("Bearer ", "")

        payload = jwt.decode(access_token, options={"verify_signature": False})
        email = payload.get("email")

        db_response = supabase.table("users_data").select("*").eq("email", email).execute()
        user = db_response.data[0]

        return UserInfo(
            message="Get info successful",
            email=user["email"],
            username=user["username"],
            created_at=user["created_at"]
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))