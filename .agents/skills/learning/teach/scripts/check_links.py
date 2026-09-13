#!/usr/bin/env python3
"""Check authored HTML for duplicate IDs, missing local files and broken HTML anchors."""
import argparse
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.ids = []
        self.links = []
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs: self.ids.append(attrs['id'])
        for key in ('href', 'src'):
            if key in attrs: self.links.append(attrs[key])

def check(root):
    root = Path(root).resolve()
    pages = {p.resolve(): Page(p.read_text(encoding='utf-8')) for p in root.rglob('*.html') if 'assets' not in p.relative_to(root).parts}
    errors = []
    for path, page in pages.items():
        errors.extend(f'{path}: duplicate ID #{name}' for name, count in Counter(page.ids).items() if count > 1)
        for link in page.links:
            url = urlsplit(link)
            if url.scheme not in ('', 'file') or url.netloc: continue
            target = (Path(unquote(url.path)) if url.scheme == 'file' else path.parent / unquote(url.path)).resolve() if url.path else path
            if not target.exists():
                errors.append(f'{path}: missing file {link}')
            elif url.fragment and target.suffix.lower() == '.html':
                if target not in pages: pages_target = Page(target.read_text(encoding='utf-8'))
                else: pages_target = pages[target]
                if unquote(url.fragment) not in pages_target.ids: errors.append(f'{path}: missing anchor {link}')
    return errors

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('root', type=Path)
    args = parser.parse_args()
    if not args.root.is_dir(): parser.error('root must be an existing library directory')
    errors = check(args.root)
    print('\n'.join(errors) if errors else 'Local HTML links and IDs pass.')
    raise SystemExit(bool(errors))

if __name__ == '__main__': main()
