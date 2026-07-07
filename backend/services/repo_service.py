from datetime import datetime
from git import Repo
import logging
import os
import shutil
import time
from services.storage_service import (
    upload_file,
    download_file,
    get_latest_version_key,
    prune_old_archives,
)

logger = logging.getLogger("repo_service")

CLONE_DIR = "repos"
ARCHIVE_DIR = os.path.join(CLONE_DIR, "archives")


def get_dir_size(path: str) -> int:
    """Calculates the total size of a directory in bytes."""
    total = 0
    if not os.path.exists(path):
        return 0
    for root, _, files in os.walk(path):
        for f in files:
            fp = os.path.join(root, f)
            try:
                if os.path.exists(fp):
                    total += os.path.getsize(fp)
            except Exception:
                pass
    return total


def archive_and_upload_repo(
    repo_path: str, repo_name: str, repo_url: str = ""
) -> bool:
    """Helper to compress local repository directory, gather Git metadata, upload to S3, and prune old files."""
    os.makedirs(ARCHIVE_DIR, exist_ok=True)
    archive_base = os.path.join(ARCHIVE_DIR, f"{repo_name}_{int(time.time())}")

    commit_sha = "unknown"
    branch_name = "unknown"
    try:
        repo = Repo(repo_path)
        commit_sha = repo.head.commit.hexsha
        branch_name = repo.active_branch.name
    except Exception:
        pass

    # 1. Capture Compression Metrics
    original_size = get_dir_size(repo_path)
    compress_start = time.time()
    try:
        zip_path = shutil.make_archive(archive_base, "zip", repo_path)
        compress_duration = time.time() - compress_start

        compressed_size = os.path.getsize(zip_path)
        ratio = (
            (compressed_size / original_size) if original_size > 0 else 1.0
        )

        # Versioned naming structure
        timestamp = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
        s3_key = f"repositories/{repo_name}/commit_{commit_sha}_{timestamp}.zip"

        metadata = {
            "repository_url": repo_url or repo_name,
            "branch": branch_name,
            "commit_sha": commit_sha,
            "upload_timestamp": datetime.utcnow().isoformat() + "Z",
            "archive_version": "1.0",
        }

        # 2. Capture Upload Metrics
        upload_start = time.time()
        success = upload_file(zip_path, s3_key, metadata=metadata)
        upload_duration = time.time() - upload_start

        # Cleanup local ZIP file
        if os.path.exists(zip_path):
            os.remove(zip_path)

        if success:
            logger.info(
                f"event=archive_uploaded repo={repo_name} "
                f"original_size={original_size} compressed_size={compressed_size} "
                f"ratio={ratio:.4f} compress_time={compress_duration:.3f}s "
                f"upload_time={upload_duration:.3f}s key={s3_key}"
            )
            # 3. Apply Cleanup Policy (retention limit 10)
            prune_old_archives(repo_name, limit=10)
        else:
            logger.error(f"event=archive_upload_failed repo={repo_name}")

        return success
    except Exception as e:
        logger.error(
            f"event=archive_failed repo={repo_name} error='{str(e)}'"
        )
        return False


def restore_repo_from_s3(repo_path: str, repo_name: str) -> bool:
    """Helper to locate, download, and extract the latest versioned repository archive from S3."""
    os.makedirs(ARCHIVE_DIR, exist_ok=True)
    zip_path = os.path.join(ARCHIVE_DIR, f"{repo_name}_restoring.zip")

    try:
        # Find the latest key from the versioned folder
        latest_key = get_latest_version_key(repo_name)
        if not latest_key:
            return False

        logger.info(
            f"event=restore_started repo={repo_name} key={latest_key}"
        )

        download_start = time.time()
        download_success = download_file(latest_key, zip_path)
        download_duration = time.time() - download_start

        if not download_success:
            logger.error(f"event=restore_download_failed repo={repo_name}")
            return False

        # Extract
        restore_start = time.time()
        os.makedirs(repo_path, exist_ok=True)
        shutil.unpack_archive(zip_path, repo_path)
        restore_duration = time.time() - restore_start

        # Cleanup local restore zip
        if os.path.exists(zip_path):
            os.remove(zip_path)

        logger.info(
            f"event=restore_complete repo={repo_name} "
            f"download_time={download_duration:.3f}s restore_time={restore_duration:.3f}s"
        )
        return True
    except Exception as e:
        logger.error(f"event=restore_failed repo={repo_name} error='{str(e)}'")
        if os.path.exists(zip_path):
            os.remove(zip_path)
        return False


def clone_repository(repo_url: str):
    os.makedirs(CLONE_DIR, exist_ok=True)

    normalized_url = repo_url.replace("\\", "/").rstrip("/")
    repo_name = normalized_url.split("/")[-1].replace(".git", "")
    repo_path = os.path.join(CLONE_DIR, repo_name)

    if os.path.exists(repo_path):
        if os.path.exists(os.path.join(repo_path, ".git")):
            return repo_path, repo_name, True

        try:
            shutil.rmtree(repo_path)
        except Exception:
            pass

    if restore_repo_from_s3(repo_path, repo_name):
        return repo_path, repo_name, False

    logger.info(
        f"event=clone_git_fallback repo={repo_name} url={repo_url}"
    )
    Repo.clone_from(repo_url, repo_path)

    return repo_path, repo_name, True
