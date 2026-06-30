import os

SUPPORTED_EXTENSIONS = {
    ".py",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".java",
    ".cpp",
    ".c",
    ".go",
    ".rs",
    ".html",
    ".css",
}


def scan_repository(repo_path: str):

    print(f"Scanning repository: {repo_path}")

    scanned_files = []

    for root, dirs, files in os.walk(repo_path):
        dirs[:] = [
            d for d in dirs if d not in {".git", "node_modules", "__pycache__", "venv"}
        ]

        for file in files:
            print(f"Found: {file}")

            ext = os.path.splitext(file)[1]

            if ext in SUPPORTED_EXTENSIONS:
                scanned_files.append(
                    {"name": file, "path": os.path.join(root, file), "extension": ext}
                )

    return {"total_files": len(scanned_files), "files": scanned_files}
