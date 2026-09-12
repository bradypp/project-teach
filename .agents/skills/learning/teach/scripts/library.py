#!/usr/bin/env python3
"""Create a portable static learning library. Existing authored pages are preserved."""
import argparse
from html import escape
from html.parser import HTMLParser
from pathlib import Path
import re
import shutil
from urllib.parse import quote

ASSETS = Path(__file__).resolve().parent.parent / 'assets'
KINDS = {'lesson': 'lessons', 'quiz': 'quizzes', 'reference': 'references', 'glossary': 'references', 'topic': 'topics'}


def copy_assets(root):
    root = Path(root)
    target = root / 'assets'
    target.mkdir(parents=True, exist_ok=True)
    for source in [*ASSETS.iterdir(), *(ASSETS / "vendor").glob("*")]:
        if source.is_file():
            destination = target / source.relative_to(ASSETS)
            destination.parent.mkdir(parents=True, exist_ok=True)
            if not destination.exists():
                shutil.copyfile(source, destination)
    return root


def init(root):
    root = copy_assets(root)
    if not (root / 'index.html').exists():
        index(root)
    return root


class TitleParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.inside = False
        self.parts = []
    def handle_starttag(self, tag, attrs):
        if tag == 'title': self.inside = True
    def handle_endtag(self, tag):
        if tag == 'title': self.inside = False
    def handle_data(self, data):
        if self.inside: self.parts.append(data)


def index(root):
    root = copy_assets(root)
    sections = []
    for folder in dict.fromkeys(KINDS.values()):
        entries = []
        for page in sorted((root / folder).glob('*.html')):
            parser = TitleParser()
            parser.feed(page.read_text(encoding='utf-8'))
            title = ''.join(parser.parts).strip() or page.stem
            href = quote(page.relative_to(root).as_posix(), safe='/')
            entries.append(f'<li><a href="{escape(href, quote=True)}">{escape(title)}</a></li>')
        if folder == 'topics' and not entries:
            continue
        content = '<ul class="page-list">' + ''.join(entries) + '</ul>' if entries else '<p class="muted">Nothing here yet.</p>'
        sections.append(f'<section class="card"><h2>{folder.capitalize()}</h2>{content}</section>')
    template = (ASSETS / 'templates/index.html').read_text(encoding='utf-8')
    root.mkdir(parents=True, exist_ok=True)
    (root / 'index.html').write_text(template.replace('{{ENTRIES}}', '\n'.join(sections)), encoding='utf-8')
    return root / 'index.html'


def new(root, kind, slug, title):
    if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', slug):
        raise ValueError('Use a lowercase hyphen-separated slug, e.g. queue-backpressure.')
    root = Path(root)
    page = root / KINDS[kind] / f'{slug}.html'
    if page.exists():
        raise FileExistsError(f'Existing page preserved: {page}')
    init(root)
    page.parent.mkdir(parents=True, exist_ok=True)
    template = (ASSETS / 'templates' / f'{kind}.html').read_text(encoding='utf-8')
    with page.open('x', encoding='utf-8') as stream:
        stream.write(template.replace('{{TITLE}}', escape(title, quote=True)))
    index(root)
    return page


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True)
    for command in ('init', 'index'):
        sub.add_parser(command).add_argument('root', type=Path)
    create = sub.add_parser('new')
    create.add_argument('root', type=Path)
    create.add_argument('kind', choices=KINDS)
    create.add_argument('slug')
    create.add_argument('--title', required=True)
    args = parser.parse_args()
    try:
        if args.command == 'new': result = new(args.root, args.kind, args.slug, args.title)
        elif args.command == 'init': result = init(args.root)
        else: result = index(args.root)
    except (ValueError, OSError) as error:
        parser.exit(1, f'{error}\n')
    print(result.resolve())

if __name__ == '__main__': main()
