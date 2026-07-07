import os
from fastapi import HTTPException


def validate_safe_path(path: str) -> str:
    """
    Validates that a file path is safe and stays within permitted directories:
    - The absolute repos/ directory (where git clones repositories)
    - The absolute project workspace root directory.
    Prevents path traversal attacks (e.g. using '..' sequences).
    """
    if not path:
        raise HTTPException(status_code=400, detail="Invalid path parameter")

    # Resolve absolute paths
    abs_path_cwd = os.path.abspath(path)
    abs_path_proj = os.path.abspath(os.path.join("..", path))

    # Determine which path actually exists or is intended
    if os.path.exists(abs_path_proj):
        abs_path = abs_path_proj
    elif os.path.exists(abs_path_cwd):
        abs_path = abs_path_cwd
    else:
        # Fallback for new files: check if directory name starts path
        cwd_name = os.path.basename(os.getcwd())  # e.g., 'backend'
        normalized_path = path.replace("\\", "/")
        if normalized_path.startswith(f"{cwd_name}/"):
            abs_path = abs_path_proj
        else:
            abs_path = abs_path_cwd

    abs_repos = os.path.abspath("repos")
    abs_workspace = os.path.abspath(".")
    abs_parent = os.path.abspath("..")

    # Ensure trailing separators are present to verify subdirectory relationship accurately
    repos_prefix = abs_repos + os.sep
    workspace_prefix = abs_workspace + os.sep
    parent_prefix = abs_parent + os.sep

    in_repos = abs_path.startswith(repos_prefix) or abs_path == abs_repos
    in_workspace = abs_path.startswith(workspace_prefix) or abs_path == abs_workspace
    in_parent = abs_path.startswith(parent_prefix) or abs_path == abs_parent

    if not (in_repos or in_workspace or in_parent):
        raise HTTPException(
            status_code=403,
            detail="Access denied: Path lies outside authorized directory boundaries.",
        )

    return abs_path
