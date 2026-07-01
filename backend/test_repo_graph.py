from services.repository_graph_service import generate_repository_graph

graph = generate_repository_graph("repos/codepilot-ai")

print("NODES:")
for node in graph["nodes"]:
    print(f"  {node['id']} ({node['label']})")

print("\nEDGES:")
for edge in graph["edges"]:
    print(f"  {edge['source']} -> {edge['target']}")
