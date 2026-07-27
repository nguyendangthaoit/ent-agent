import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router

# initialize instance FastAPI
app = FastAPI(
    title="Ent-Agent API",
    description="Enterprise AI Agent Core Service",
    version="1.0.0",
)

# config CORS for Frontend (Next.js)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # URL of Frontend Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/")
async def root():
    return {"status": "healthy", "message": "Ent-Agent Backend API is running"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
