from fastapi import FastAPI
from api.repository import router as repo_router
from api.scanner import router as scanner_router

app = FastAPI(
    title="CodePilot AI",
    version="1.0.0"
)

app.include_router(
    repo_router,
    prefix="/repository",
    tags=["Repository"]
)


@app.get("/")
def root():
    return {
        "message": "CodePilot AI Running"
    }
    
app.include_router(
    scanner_router,
    prefix="/scanner",
    tags=["Scanner"]
)    