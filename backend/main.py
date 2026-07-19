from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from database import supabase
from schemas import UserResponse, RecordCreate

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

@app.post("/record")
def create_record(body: RecordCreate, user=Depends(get_current_user)):
    try:
        position = body.position
        col_map = {1: "first_record", 2: "second_record", 3: "third_record"}
        col_name = col_map.get(position)
            
        query = supabase.table("users_data").select(col_name).eq("id", user.id).execute()
        old_uuid = query.data[0][col_name]

        if old_uuid is not None:
            supabase.table("records").delete().eq("id", old_uuid).execute()

        res = supabase.table("records").insert({
            "user_id": user.id,
            "record": body.record
        }).execute()

        new_uuid = res.data[0]["id"]
        supabase.table("users_data").update({col_name: new_uuid}).eq("id", user.id).execute()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving record: {str(e)}")
    return res.data

@app.get("/records")
def get_records(user=Depends(get_current_user)):
    try:
        res = supabase.table("users_data").select("first_record, second_record, third_record").eq("id", user.id).execute()
        res.data[0]
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Error fetching records: {str(e)}")
    return res.data

@app.delete("/record/{position}")
def delete_record(position: int, user=Depends(get_current_user)):
    try:
        col_map = {1: "first_record", 2: "second_record", 3: "third_record"}
        col_name = col_map.get(position)
            
        query = supabase.table("users_data").select(col_name).eq("id", user.id).execute()
        old_uuid = query.data[0][col_name]

        supabase.table("records").delete().eq("id", old_uuid).execute()

        supabase.table("users_data").update({col_name: None}).eq("id", user.id).execute()

    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Error deleting record: {str(e)}")
    
    return query.data

@app.get("/record/{position}")
def get_record(position: int, user=Depends(get_current_user)):
    col_map = {1: "first_record", 2: "second_record", 3: "third_record"}
    col_name = col_map.get(position)
    if not col_name:
        raise HTTPException(status_code=400, detail="Invalid position")
    try:
        query = supabase.table("users_data").select(col_name).eq("id", user.id).single().execute()
        record_id = query.data[col_name]
        if record_id is None:
            raise HTTPException(status_code=404, detail="No recording at this position")
        res = supabase.table("records").select("record").eq("id", record_id).single().execute()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Error fetching record: {str(e)}")
    return res.data