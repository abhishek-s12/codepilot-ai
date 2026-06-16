from services.repository_call_graph_service import (
    build_repository_call_graph
)


def generate_flow(repo_path: str):

    graph = build_repository_call_graph(repo_path)

    flows = []

    for function, calls in graph.items():

        if not calls:
            continue

        flow = function

        for call in calls:

            flow += f"\n    ->\n{call}"

        flows.append(flow)

    result = "\n\n".join(flows)

    print("FINAL FLOW:")
    print(result)

    return result