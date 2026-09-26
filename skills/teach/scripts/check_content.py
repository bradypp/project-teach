#!/usr/bin/env python3
"""Check structural rules in authored notebook HTML."""

import argparse
from html.parser import HTMLParser
from pathlib import Path
from typing import NamedTuple


class Element(NamedTuple):
    tag: str
    attrs: dict[str, str | None]
    line: int
    parents: tuple[int, ...]
    text: str = ""


VOID_ELEMENTS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
    "meta", "param", "source", "track", "wbr",
}


def has_class(element: Element, name: str) -> bool:
    return name in (element.attrs.get("class") or "").split()


class Page(HTMLParser):
    def __init__(self, source: str):
        super().__init__()
        self.text: dict[int, list[str]] = {}
        self._open_pre: int | None = None
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        self.elements.append(Element(tag, dict(attrs), self.getpos()[0], tuple(self.stack)))
        if tag not in VOID_ELEMENTS:
            self.stack.append(len(self.elements) - 1)

    def handle_startendtag(self, tag, attrs):
        self.elements.append(Element(tag, dict(attrs), self.getpos()[0], tuple(self.stack)))

    def _track_pre(self, tag: str, element_index: int | None, *, opening: bool):
        if tag == "pre":
            self._open_pre = element_index if opening else None


    def handle_data(self, data):
        if self._open_pre is not None:
            self.text.setdefault(self._open_pre, []).append(data)
    def handle_endtag(self, tag):
        for position in range(len(self.stack) - 1, -1, -1):
            if self.elements[self.stack[position]].tag == tag:
                del self.stack[position:]
                break


def check_diagram_container(page: Page) -> list[tuple[int, str]]:
    return [
        (element.line, f'"diagram" class must be on a <figure> (found <{element.tag}>)')
        for element in page.elements
        if has_class(element, "diagram") and element.tag != "figure"
    ]


def check_mermaid_source(page: Page) -> list[tuple[int, str]]:
    return [
        (element.line, 'pre.mermaid must be inside a <figure class="diagram">')
        for element in page.elements
        if element.tag == "pre" and has_class(element, "mermaid")
        and not any(
            page.elements[parent].tag == "figure"
            and has_class(page.elements[parent], "diagram")
            for parent in element.parents
        )
    ]


# Add future page rules here; each returns (line, message) diagnostics.
CHECKS = (check_diagram_container, check_mermaid_source)


def check(path: Path) -> list[str]:
    path = Path(path)
    if path.is_file() and path.suffix.lower() == ".html":
        pages = [path]
    elif path.is_dir():
        pages = sorted(
            page for page in path.rglob("*.html")
            if "assets" not in page.relative_to(path).parts
        )
    else:
        raise ValueError("path must be an HTML file or notebook directory")

    errors = []
    for page_path in pages:
        page = Page(page_path.read_text(encoding="utf-8"))
        for rule in CHECKS:
            errors.extend(
                f"{page_path}:{line}: {message}"
                for line, message in rule(page)
            )
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("path", type=Path, help="HTML file or notebook directory")
    args = parser.parse_args()
    try:
        errors = check(args.path)
    except ValueError as error:
        parser.error(str(error))
    print("\n".join(errors) if errors else "HTML content checks pass.")
    raise SystemExit(bool(errors))


if __name__ == "__main__":
    main()
