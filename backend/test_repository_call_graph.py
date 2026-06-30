from services.repository_call_graph_service import build_repository_call_graph

graph = build_repository_call_graph("repos/codepilot-ai")

for func, calls in graph.items():
    print(func)

    print(" -> ", calls)

    print()
