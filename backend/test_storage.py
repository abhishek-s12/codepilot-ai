import os
from services.storage_service import (
    ensure_bucket_exists,
    upload_file,
    download_file,
    delete_file,
    list_files,
    get_s3_client,
)


def test_storage_service_offline_or_online():
    client = get_s3_client()
    if client is None:
        print(
            "[Test Storage] S3/MinIO client could not be initialized. Skipping active test."
        )
        return

    try:
        client.list_buckets()
    except Exception:
        print("[Test Storage] S3/MinIO is unreachable. Skipping live S3 operations.")
        return

    assert ensure_bucket_exists() is True

    test_file = "test_s3_dummy.txt"
    test_content = "Hello CodePilot S3 Storage"

    with open(test_file, "w") as f:
        f.write(test_content)

    s3_key = "tests/dummy.txt"
    try:
        assert upload_file(test_file, s3_key) is True

        files = list_files(prefix="tests/")
        assert s3_key in files

        dest_file = "test_s3_downloaded.txt"
        assert download_file(s3_key, dest_file) is True

        with open(dest_file, "r") as f:
            content = f.read()
        assert content == test_content

        assert delete_file(s3_key) is True

        if os.path.exists(dest_file):
            os.remove(dest_file)
    finally:
        if os.path.exists(test_file):
            os.remove(test_file)
