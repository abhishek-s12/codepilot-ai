import os
from services.scanner_service import scan_repository
from services.reader_service import read_file
from services.call_graph_service import extract_function_calls
from services.repository_graph_service import generate_repository_graph


def build_repository_call_graph(repo_path: str):
    # 1. Generate import graph to assist in cross-file resolution
    import_graph = generate_repository_graph(repo_path)
    
    # 2. Extract call graph for each file with file-relative path keys
    raw_graph = {}  # maps (file_rel_path, func_name) -> [raw_calls...]
    defined_functions_by_file = {}  # maps file_rel_path -> set of func_names
    all_defined_functions = {}  # maps func_name -> list of file_rel_paths where it is defined

    scan_result = scan_repository(repo_path)

    for file in scan_result["files"]:
        if file["extension"] != ".py":
            continue

        file_path = file["path"]
        file_rel_path = os.path.relpath(file_path, repo_path).replace("\\", "/")

        content = read_file(file_path)
        file_graph = extract_function_calls(content)

        defined_functions_by_file[file_rel_path] = set()

        for func_name, calls in file_graph.items():
            raw_graph[(file_rel_path, func_name)] = calls
            defined_functions_by_file[file_rel_path].add(func_name)
            
            if func_name not in all_defined_functions:
                all_defined_functions[func_name] = []
            all_defined_functions[func_name].append(file_rel_path)

    # 3. Resolve calls to fully-qualified names
    resolved_graph = {}

    for (file_rel_path, func_name), calls in raw_graph.items():
        qualified_key = f"{file_rel_path}::{func_name}"
        resolved_calls = []

        file_imports = import_graph.get(file_rel_path, [])

        for call in calls:
            resolved_call = None

            # Case A: Call is defined in the same file
            if call in defined_functions_by_file[file_rel_path]:
                resolved_call = f"{file_rel_path}::{call}"
            
            # Case B: Call matches ClassName.method, and ClassName is defined in the same file
            elif "." in call:
                parts = call.split(".")
                class_name = parts[0]
                if class_name in defined_functions_by_file[file_rel_path]:
                    resolved_call = f"{file_rel_path}::{call}"

            # Case C: Check if call (or class name) matches imported modules
            if not resolved_call:
                for imp in file_imports:
                    # Resolve other file matching module name
                    for other_file in defined_functions_by_file.keys():
                        other_module_name = os.path.splitext(other_file)[0].replace("/", ".")
                        if other_module_name.endswith(imp) or imp.endswith(other_module_name):
                            if call in defined_functions_by_file[other_file]:
                                resolved_call = f"{other_file}::{call}"
                                break
                            elif "." in call:
                                class_name = call.split(".")[0]
                                if class_name in defined_functions_by_file[other_file]:
                                    resolved_call = f"{other_file}::{call}"
                                    break
                    if resolved_call:
                        break

            # Case D: If not resolved yet, check if the function is uniquely defined in the repo
            if not resolved_call:
                matching_files = all_defined_functions.get(call, [])
                if len(matching_files) == 1:
                    resolved_call = f"{matching_files[0]}::{call}"
                elif "." in call:
                    class_name = call.split(".")[0]
                    matching_class_files = all_defined_functions.get(class_name, [])
                    if len(matching_class_files) == 1:
                        resolved_call = f"{matching_class_files[0]}::{call}"

            if resolved_call:
                resolved_calls.append(resolved_call)

        resolved_graph[qualified_key] = list(set(resolved_calls))

    return resolved_graph