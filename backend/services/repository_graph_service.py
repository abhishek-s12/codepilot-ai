import os
import ast


def generate_repository_graph(repo_path: str):

    graph = {}

    for root, _, files in os.walk(repo_path):

        for file in files:

            if not file.endswith(".py"):
                continue

            file_path = os.path.join(root, file)

            try:

                with open(
                    file_path,
                    "r",
                    encoding="utf-8"
                ) as f:

                    code = f.read()

                tree = ast.parse(code)

                imports = []

                for node in ast.walk(tree):

                    if isinstance(node, ast.Import):

                        for name in node.names:
                            imports.append(name.name)

                    elif isinstance(node, ast.ImportFrom):

                        if node.module:
                            imports.append(node.module)

                relative_path = os.path.relpath(file_path, repo_path).replace("\\", "/")
                graph[relative_path] = imports

            except Exception as e:

                print(
                    f"Graph Error: {file_path} -> {e}"
                )

    return graph