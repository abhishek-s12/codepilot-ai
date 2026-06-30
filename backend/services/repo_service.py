from git import Repo
import os

CLONE_DIR = "repos"


def clone_repository(repo_url: str):

    os.makedirs(CLONE_DIR, exist_ok=True)

    normalized_url = repo_url.replace("\\", "/").rstrip("/")

    repo_name = normalized_url.split("/")[-1].replace(".git", "")

    repo_path = os.path.join(CLONE_DIR, repo_name)

    if os.path.exists(repo_path):
        if os.path.exists(os.path.join(repo_path, ".git")):
            return repo_path
        import shutil

        try:
            shutil.rmtree(repo_path)
        except Exception:
            pass

    Repo.clone_from(repo_url, repo_path)

    return repo_path
