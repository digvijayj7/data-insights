from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import upload

app = FastAPI(title="CSV Dashboard API")

# Enable CORS so the React (Vite) frontend can call this API.
# `allow_origins=["*"]` is fine for local dev; tighten to the Vite origin
# (e.g. "http://localhost:5173") for production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the /upload endpoint at the root so it's reachable at POST /upload
# (the React client calls "/upload").
app.include_router(upload.router, tags=["upload"])


@app.get("/")
def health():
    return {"status": "ok"}
