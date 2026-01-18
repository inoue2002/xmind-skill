#!/usr/bin/env python3
"""
XMind Editor - Create and edit XMind files

Supports creating new XMind files and editing existing ones.
Works with XMind Zen format (content.json).

Usage:
    python xmind_editor.py create <output.xmind> --root "Root Topic"
    python xmind_editor.py show <file.xmind>
    python xmind_editor.py add <file.xmind> --parent "Parent" --topic "New Topic"
    python xmind_editor.py edit <file.xmind> --target "Old Title" --title "New Title"
    python xmind_editor.py delete <file.xmind> --target "Topic to Delete"
"""

import argparse
import json
import sys
import uuid
import zipfile
from pathlib import Path
from typing import Optional
import tempfile
import shutil


def generate_id() -> str:
    """Generate a unique ID for XMind elements."""
    return str(uuid.uuid4()).replace("-", "")[:24]


def create_topic(title: str, children: list = None) -> dict:
    """Create a new topic structure."""
    topic = {
        "id": generate_id(),
        "class": "topic",
        "title": title,
    }
    if children:
        topic["children"] = {"attached": children}
    return topic


def create_empty_xmind(root_title: str = "Central Topic") -> list:
    """Create an empty XMind content structure."""
    return [
        {
            "id": generate_id(),
            "class": "sheet",
            "title": "Sheet 1",
            "rootTopic": create_topic(root_title),
        }
    ]


def read_xmind(file_path: str) -> tuple[list, zipfile.ZipFile]:
    """Read content.json from XMind file."""
    zf = zipfile.ZipFile(file_path, "r")
    content = json.loads(zf.read("content.json"))
    return content, zf


def write_xmind(file_path: str, content: list, original_zf: zipfile.ZipFile = None):
    """Write content to XMind file."""
    # Create a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".xmind") as tmp:
        tmp_path = tmp.name

    with zipfile.ZipFile(tmp_path, "w", zipfile.ZIP_DEFLATED) as zf:
        # Write content.json
        zf.writestr("content.json", json.dumps(content, ensure_ascii=False, indent=2))

        # Copy other files from original if exists
        if original_zf:
            for item in original_zf.namelist():
                if item != "content.json":
                    zf.writestr(item, original_zf.read(item))
        else:
            # Create minimal metadata for new files
            metadata = {"creator": {"name": "XMind Editor", "version": "1.0.0"}}
            zf.writestr("metadata.json", json.dumps(metadata))

    # Close original zip if open
    if original_zf:
        original_zf.close()

    # Move temp file to target
    shutil.move(tmp_path, file_path)


def find_topic(topic: dict, title: str) -> Optional[dict]:
    """Find a topic by title (recursive)."""
    if topic.get("title") == title:
        return topic

    children = topic.get("children", {}).get("attached", [])
    for child in children:
        result = find_topic(child, title)
        if result:
            return result
    return None


def find_topic_parent(topic: dict, title: str, parent: dict = None) -> tuple[Optional[dict], Optional[dict]]:
    """Find a topic and its parent by title."""
    if topic.get("title") == title:
        return topic, parent

    children = topic.get("children", {}).get("attached", [])
    for child in children:
        result, found_parent = find_topic_parent(child, title, topic)
        if result:
            return result, found_parent
    return None, None


def topic_to_tree(topic: dict, level: int = 0) -> str:
    """Convert topic to tree representation."""
    lines = []
    indent = "  " * level
    prefix = "- " if level > 0 else ""
    lines.append(f"{indent}{prefix}{topic.get('title', 'Untitled')}")

    children = topic.get("children", {}).get("attached", [])
    for child in children:
        lines.append(topic_to_tree(child, level + 1))

    return "\n".join(lines)


def cmd_create(args):
    """Create a new XMind file."""
    content = create_empty_xmind(args.root)
    write_xmind(args.file, content)
    print(f"Created: {args.file}")
    print(f"Root topic: {args.root}")


def cmd_show(args):
    """Show XMind structure."""
    content, zf = read_xmind(args.file)
    zf.close()

    for sheet in content:
        print(f"=== {sheet.get('title', 'Sheet')} ===")
        root = sheet.get("rootTopic", {})
        print(topic_to_tree(root))
        print()


def cmd_add(args):
    """Add a topic to XMind file."""
    content, zf = read_xmind(args.file)

    for sheet in content:
        root = sheet.get("rootTopic", {})
        parent = find_topic(root, args.parent)
        if parent:
            if "children" not in parent:
                parent["children"] = {"attached": []}
            if "attached" not in parent["children"]:
                parent["children"]["attached"] = []

            new_topic = create_topic(args.topic)
            parent["children"]["attached"].append(new_topic)
            write_xmind(args.file, content, zf)
            print(f"Added '{args.topic}' under '{args.parent}'")
            return

    zf.close()
    print(f"Error: Parent topic '{args.parent}' not found")
    sys.exit(1)


def cmd_edit(args):
    """Edit a topic title."""
    content, zf = read_xmind(args.file)

    for sheet in content:
        root = sheet.get("rootTopic", {})
        topic = find_topic(root, args.target)
        if topic:
            old_title = topic["title"]
            topic["title"] = args.title
            write_xmind(args.file, content, zf)
            print(f"Renamed '{old_title}' to '{args.title}'")
            return

    zf.close()
    print(f"Error: Topic '{args.target}' not found")
    sys.exit(1)


def cmd_delete(args):
    """Delete a topic."""
    content, zf = read_xmind(args.file)

    for sheet in content:
        root = sheet.get("rootTopic", {})

        # Cannot delete root
        if root.get("title") == args.target:
            zf.close()
            print("Error: Cannot delete root topic")
            sys.exit(1)

        topic, parent = find_topic_parent(root, args.target)
        if topic and parent:
            parent["children"]["attached"].remove(topic)
            # Clean up empty children
            if not parent["children"]["attached"]:
                del parent["children"]
            write_xmind(args.file, content, zf)
            print(f"Deleted '{args.target}'")
            return

    zf.close()
    print(f"Error: Topic '{args.target}' not found")
    sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="XMind Editor - Create and edit XMind files")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # create
    p_create = subparsers.add_parser("create", help="Create a new XMind file")
    p_create.add_argument("file", help="Output file path")
    p_create.add_argument("--root", default="Central Topic", help="Root topic title")

    # show
    p_show = subparsers.add_parser("show", help="Show XMind structure")
    p_show.add_argument("file", help="XMind file path")

    # add
    p_add = subparsers.add_parser("add", help="Add a topic")
    p_add.add_argument("file", help="XMind file path")
    p_add.add_argument("--parent", required=True, help="Parent topic title")
    p_add.add_argument("--topic", required=True, help="New topic title")

    # edit
    p_edit = subparsers.add_parser("edit", help="Edit a topic title")
    p_edit.add_argument("file", help="XMind file path")
    p_edit.add_argument("--target", required=True, help="Target topic title")
    p_edit.add_argument("--title", required=True, help="New title")

    # delete
    p_delete = subparsers.add_parser("delete", help="Delete a topic")
    p_delete.add_argument("file", help="XMind file path")
    p_delete.add_argument("--target", required=True, help="Topic to delete")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(1)

    commands = {
        "create": cmd_create,
        "show": cmd_show,
        "add": cmd_add,
        "edit": cmd_edit,
        "delete": cmd_delete,
    }

    commands[args.command](args)


if __name__ == "__main__":
    main()
