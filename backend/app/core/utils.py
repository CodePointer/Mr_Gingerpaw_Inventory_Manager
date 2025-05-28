# -*- coding = utf-8 -*-

from typing import List, Optional


def parse_tags(tags: Optional[str]) -> Optional[List[int]]:
    if tags is None or tags.strip == "":
        return None
    return [int(tag) for tag in tags.split(",") if tag.strip().isdigit()]
