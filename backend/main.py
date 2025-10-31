from contextlib import asynccontextmanager
from fastapi import FastAPI,Depends
from sqlmodel import Session
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware

from db.main import create_db_and_tables
from  config import settings
from auth.routes import router as auth_router
from users.routes import router as users_router
from recipes.routes import router as recipes_router
from pantry.routes import router as pantry_router
from leftovers.routes import router as leftovers_router
from db.main import get_session
@asynccontextmanager
async def lifespan(app: FastAPI):
    #startup
    print("creating database tables...")
    await create_db_and_tables()

    #configure GEMINI AI
    genai.configure(api_key=settings.GEMINI_API_KEY)
    print("GEMINI AI configured successfully")

    yield
    #shutdown
    print("shutting down...")


app = FastAPI(
    title="AI Recipe App",
    description="AI-powered recipe generator with personalized recommendations",
    version="1.0.0",
    lifespan=lifespan
)
#CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Include routers
app.include_router(auth_router,prefix="/auth",tags=["Authentication"])
app.include_router(users_router,prefix="/users",tags=["Users"])
app.include_router(recipes_router,prefix="/recipes",tags=["Recipes"])
app.include_router(pantry_router,prefix="/pantry",tags=["Pantry"])
app.include_router(leftovers_router,prefix="/leftovers",tags=["Leftovers"])

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/health")
async def health_check(session:Session=Depends(get_session)):
    return {"status": "ok","database":"connected"}