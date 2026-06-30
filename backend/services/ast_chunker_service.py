import ast


def chunk_python_file(code: str):

    chunks = []

    try:

        lines = code.splitlines()

        tree = ast.parse(code)

        for node in tree.body:

            if isinstance(
                node,
                (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)
            ):

                chunk_code = "\n".join(
                    lines[
                        node.lineno - 1:
                        node.end_lineno
                    ]
                )

                chunks.append({

                    "name": node.name,

                    "type": type(node).__name__,

                    "content": chunk_code,

                    "line_start": node.lineno,

                    "line_end": node.end_lineno

                })

    except Exception as e:

        print(f"AST Error: {e}")

    return chunks