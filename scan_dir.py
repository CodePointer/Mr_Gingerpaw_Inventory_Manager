# -*- coding: utf-8 -*-

from io import TextIOWrapper
from pathlib import Path
from typing import Dict
from pathspec import PathSpec


def load_gitignore(path: Path) -> PathSpec:
    gitignore_path = path / ".gitignore"
    if gitignore_path.exists():
        with open(gitignore_path, "r") as f:
            ignore_patterns = f.read().splitlines()
        return PathSpec.from_lines("gitwildmatch", ignore_patterns)
    return PathSpec([])


# def scan_directory(path: Path, 
#                    spec: PathSpec, 
#                    extensions: List[str],
#                    markdown_file: TextIOWrapper,
#                    root_path: Path,
#                    indent: int = 0):
#     for entry in path.iterdir():
#         if spec.match_file(str(entry.relative_to(path.root))):
#             continue

#         prefix = "    " * indent + "|-- "
#         print(prefix + entry.name)
#         if entry.is_dir():
#             scan_directory(entry, spec, indent + 1)
#     pass


def scan_directory(path: Path, 
                   spec: PathSpec, 
                   extensions: Dict,
                   markdown_file: TextIOWrapper,
                   root_path: Path):
    for entry in path.iterdir():
        if spec.match_file(str(entry.relative_to(path.root))):
            continue

        if entry.is_dir():
            scan_directory(entry, spec, extensions, markdown_file, root_path)
        elif entry.is_file() and entry.suffix in extensions.keys():
            relative_path = entry.relative_to(root_path)
            markdown_file.write(f"## {relative_path}\n\n")
            with open(entry, "r", encoding="utf-8") as f:
                content = f.read().strip()
                if content:
                    code_type = extensions[entry.suffix]
                    markdown_file.write(f"```{code_type}\n{content}\n```\n\n")
    pass


def main(folder, output_file=None, extensions=None):
    if output_file is None:
        output_file = f"{folder.name}_summary.md"
    
    if extensions is None:
        extensions = {".tsx": "javascript", ".ts": "javascript", ".json": "json"}

    directory = Path(folder)
    if directory.exists():
        spec = load_gitignore(directory)
        with open(output_file, "w", encoding="utf-8") as file:
            scan_directory(directory, spec, extensions, file, directory)
    pass


if __name__ == "__main__":
    folder_name = "frontend"
    extensions = {".tsx": "javascript", ".ts": "javascript", ".json": "json"}

    # folder_name = "backend"
    # extensions = {".py": "python", ".json": "json"}
    main(Path(f"./{folder_name}"), f"{folder_name}_code.md", extensions=extensions)
