# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import auth, lessons, transcribe, score, attempts, leaderboard,preference
from app.db.database import engine, Base
from app.core.firebase import init_firebase 

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize Firebase
init_firebase()

app = FastAPI(title="Language Learning API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
# app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(lessons.router, prefix="/lessons", tags=["lessons"])
app.include_router(preference.router, prefix="/preference", tags=["preference"])

app.include_router(transcribe.router, prefix="/transcribe", tags=["transcribe"])
app.include_router(score.router, prefix="/score", tags=["score"])
app.include_router(attempts.router, prefix="/attempts", tags=["attempts"])
app.include_router(leaderboard.router, prefix="/leaderboard", tags=["leaderboard"])


@app.get("/")
async def root():
    return {"message": "Language Learning API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
