from services.repository_graph_service import (
    generate_repository_graph
)

graph = generate_repository_graph(
    "repos/codepilot-ai"
)

for function, calls in graph.items():

    print(function)

    print(" -> ", calls)

    print()