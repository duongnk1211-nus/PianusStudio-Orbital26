from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from database import supabase
from schemas import UserResponse

app = FastAPI()
bearer = HTTPBearer()

origins = [
    "http://localhost:5173",
    "https://pianus-studio-orbital26.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Verify Supabase JWT and return user id:
def get_current_user(creds: HTTPAuthorizationCredentials = Depends(bearer)):
    try:
        user = supabase.auth.get_user(creds.credentials)
        return user.user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


@app.get("/user", response_model = UserResponse)
def get_user(user= Depends(get_current_user)):
    try:
        res = supabase.table("users_data").select("*").eq("id", user.id).single().execute()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Error finding user: {str(e)}")
    return res.data

@app.put("/user")
def update_user(body: dict, user=Depends(get_current_user)):
    allowed = {k: body[k] for k in ("username", "bio", "avatar_url", "binding_option", ) if k in body}
    try:
        res = supabase.table("users_data").update(allowed).eq("id", user.id).execute()
    except Exception as e:
        raise HTTPException(status_code=501, detail=f"Error saving user: {str(e)}")
    return res.data

@app.post("/user/avatar")
async def upload_avatar(file: UploadFile = File(...), user=Depends(get_current_user)):
    allowed_exts = {"jpg", "jpeg", "png"}
    ext = file.filename.split(".")[-1]
    if ext not in allowed_exts:
        raise HTTPException(status_code=400, detail="Unsupported file type")
    path = f"{user.id}/avatar.{ext}"
    contents = await file.read()
    try: 
        supabase.storage.from_("avatars").upload(path, contents, {"upsert": "true"})
        url = supabase.storage.from_("avatars").get_public_url(path)
        supabase.table("users_data").update({"avatar_url": url}).eq("id", user.id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving avatar: {str(e)}")
    return {"avatar_url": url}

from schemas import UserResponse, PieceCreate

@app.post("/piece")
def create_piece(body: PieceCreate, user=Depends(get_current_user)):
    try:
        res = supabase.table("pieces").insert({
            "user_id": user.id,
            "piece": body.piece
        }).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving piece: {str(e)}")
    return res.data

@app.get("/pieces")
def get_pieces(user=Depends(get_current_user)):
    try:
        res = supabase.table("pieces").select("*").eq("user_id", user.id).execute()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Error fetching pieces: {str(e)}")
    return res.data
