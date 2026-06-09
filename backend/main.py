from fastapi import FastAPI, HTTPException
from database import supabase
from schemas import RegisterRequest, LoginRequest, RegisterResponseModel, LoginResponseModel

app = FastAPI()

@app.post("/register", response_model=RegisterResponseModel)
async def register_user(register_request: RegisterRequest):
    try:
        response = supabase.table("users_data").insert({
            "username": register_request.username,
            "password": register_request.password
        }).execute()
        return RegisterResponseModel(
            message="User registered successfully",
            id=response.data[0]["id"],
            username=response.data[0]["username"],
            password=response.data[0]["password"],
            created_at=response.data[0]["created_at"]
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/login", response_model=LoginResponseModel)
async def login_user(login_request: LoginRequest):
    try:
        response = supabase.table("users_data").select("*").eq("username", login_request.username).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="User not found")
        user = response.data[0]
        if user["password"] != login_request.password:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return LoginResponseModel(
            message="Login successful",
            id=user["id"],
            username=user["username"],
            password=user["password"],
            created_at=user["created_at"]
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/users/{user_id}", response_model=RegisterResponseModel)
async def get_user_by_id(user_id: int):
    try:
        response = supabase.table("users_data").select("*").eq("id", user_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="User not found")
        return RegisterResponseModel(
            message="User retrieved successfully",
            id=response.data[0]["id"],
            username=response.data[0]["username"],
            password=response.data[0]["password"],
            created_at=response.data[0]["created_at"]
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))