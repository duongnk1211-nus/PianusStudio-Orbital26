from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SERVICE_ROLE_KEY")

print("URL:", SUPABASE_URL)
print("KEY:", SUPABASE_KEY[:20] if SUPABASE_KEY else "NONE")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)