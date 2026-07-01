from fastapi import APIRouter, HTTPException, Depends
import os
import shutil

from api.auth import get_current_user_id
from services.db_service import (
    get_repositories_for_user,
    get_repository,
    delete_repository,
)
from vector_store.chroma_service import delete_collection, get_collection_name_for_path

router = APIRouter()


@router.get("")
def list_repositories(user_id: str = Depends(get_current_user_id)):
    """Retrieve history of all indexed repositories for the authenticated user."""
    return get_repositories_for_user(user_id)


@router.get("/{repo_id}")
def fetch_repository_details(repo_id: str, user_id: str = Depends(get_current_user_id)):
    """Fetch details of a single indexed repository."""
    repo = get_repository(repo_id)
    if not repo:
        raise HTTPException(status_code=404, detail="Repository not found.")
    if repo["user_id"] != user_id:
        raise HTTPException(
            status_code=403,
            detail="Access Denied: You do not own this repository.",
        )
    return repo


@router.delete("/{repo_id}")
def delete_repository_index(repo_id: str, user_id: str = Depends(get_current_user_id)):
    """Delete a repository index: deletes database record, ChromaDB collection, and local folder."""
    repo = get_repository(repo_id)
    if not repo:
        raise HTTPException(status_code=404, detail="Repository not found.")
    if repo["user_id"] != user_id:
        raise HTTPException(
            status_code=403,
            detail="Access Denied: You do not own this repository.",
        )

    # 1. Delete ChromaDB collection
    collection_name = get_collection_name_for_path(repo["repository_path"])
    delete_collection(collection_name)

    # 2. Delete local folder on disk (if it exists under repos/)
    repo_path = repo["repository_path"]
    abs_path = os.path.abspath(repo_path)
    abs_repos = os.path.abspath("repos")

    if abs_path.startswith(abs_repos) and os.path.exists(abs_path):
        try:
            shutil.rmtree(abs_path)
        except Exception as e:
            print(f"Error deleting folder {abs_path}: {e}")

    # 3. Delete database record
    delete_repository(repo_id)

    return {"status": "success", "message": "Repository index deleted successfully."}
