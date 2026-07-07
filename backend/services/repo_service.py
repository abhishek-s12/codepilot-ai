from git import Repo
import os
import shutil
from services.storage_service import upload_file, download_file, list_files

CLONE_DIR = "repos"
ARCHIVE_DIR = os.path.join(CLONE_DIR, "archives")


def archive_and_upload_repo(repo_path: str, repo_name: str) -> bool:
    """Helper to compress local repository directory to a zip and upload to S3."""
    os.makedirs(ARCHIVE_DIR, exist_ok=True)
    archive_base = os.path.join(ARCHIVE_DIR, repo_name)
    try:
        zip_path = shutil.make_archive(archive_base, "zip", repo_path)
        s3_key = f"repositories/{repo_name}.zip"
        success = upload_file(zip_path, s3_key)

        if os.path.exists(zip_path):
            os.remove(zip_path)
        return success
    except Exception as e:
        print(f"[Repo Service] Failed to archive repository {repo_name}: {e}")
        return False


def restore_repo_from_s3(repo_path: str, repo_name: str) -> bool:
    """Helper to download and extract repository from S3."""
    os.makedirs(ARCHIVE_DIR, exist_ok=True)
    zip_path = os.path.join(ARCHIVE_DIR, f"{repo_name}.zip")
    s3_key = f"repositories/{repo_name}.zip"

    try:
        existing_keys = list_files(prefix=s3_key)
        if s3_key not in existing_keys:
            return False

        print(f"[Repo Service] Restoring {repo_name} from S3 object storage...")
        if download_file(s3_key, zip_path):
            os.makedirs(repo_path, exist_ok=True)
            shutil.unpack_archive(zip_path, repo_path)
            if os.path.exists(zip_path):
                os.remove(zip_path)
            return True
        return False
    except Exception as e:
        print(f"[Repo Service] Failed to restore repository {repo_name} from S3: {e}")
        return False


def clone_repository(repo_url: str):
    os.makedirs(CLONE_DIR, exist_ok=True)

    normalized_url = repo_url.replace("\\", "/").rstrip("/")
    repo_name = normalized_url.split("/")[-1].replace(".git", "")
    repo_path = os.path.join(CLONE_DIR, repo_name)

    if os.path.exists(repo_path):
        if os.path.exists(os.path.join(repo_path, ".git")):
            archive_and_upload_repo(repo_path, repo_name)
            return repo_path

        try:
            shutil.rmtree(repo_path)
        except Exception:
            pass

    if restore_repo_from_s3(repo_path, repo_name):
        return repo_path

    print(f"[Repo Service] S3 cache miss. Cloning {repo_url} via git...")
    Repo.clone_from(repo_url, repo_path)

    archive_and_upload_repo(repo_path, repo_name)

    return repo_path
