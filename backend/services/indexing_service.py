import uuid

from services.scanner_service import scan_repository
from services.reader_service import read_file
from services.chunker_service import chunk_text

from vector_store.chroma_service import add_chunk


def index_repository(repo_path: str):

    scan_result = scan_repository(repo_path)

    indexed_chunks = 0

    for file in scan_result["files"]:

        file_path = file["path"]

        content = read_file(file_path)

        if not content.strip():
            continue

        chunks = chunk_text(content)

        for chunk in chunks:

            chunk_id = str(uuid.uuid4())

            add_chunk(
                chunk_id=chunk_id,
                text=chunk,
                metadata={
                    "file_name": file["name"],
                    "file_path": file_path
                }
            )

            indexed_chunks += 1

    return {
        "files_indexed": scan_result["total_files"],
        "chunks_indexed": indexed_chunks
    }