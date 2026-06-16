from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.repository import router as repo_router
from api.scanner import router as scanner_router
from api.indexer import router as indexer_router
from api.search import router as search_router
from api.ask import router as ask_router
from api.architecture import router as architecture_router
from api.review import router as review_router
from api.graph import router as graph_router
from api.call_graph import router as call_graph_router
from api.flow import router as flow_router

app = FastAPI(
    title="CodePilot AI",
    version="1.0.0"
)

# ADD THIS BLOCK
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

app.include_router(
    indexer_router,
    prefix="/indexer",
    tags=["Indexer"]
)

app.include_router(
    search_router,
    prefix="/search",
    tags=["Search"]
)

app.include_router(
    ask_router,
    prefix="/ai",
    tags=["AI Assistant"]
)

app.include_router(
    architecture_router,
    prefix="/repository",
    tags=["Architecture"]
)

app.include_router(
    review_router,
    prefix="/repository",
    tags=["Review"]
)

app.include_router(
    graph_router,
    prefix="/repository",
    tags=["Graph"]
)

app.include_router(
    call_graph_router,
    prefix="/repository",
    tags=["Call Graph"]
)

app.include_router(
    flow_router,
    prefix="/repository",
    tags=["Flow"]
)