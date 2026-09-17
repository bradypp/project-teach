#!/usr/bin/env python3
"""Create a portable static learning library. Existing authored pages are preserved."""
import argparse
from datetime import datetime, timezone
from html import escape
from html.parser import HTMLParser
from pathlib import Path
import re
import shutil
from urllib.parse import quote

ASSETS = Path(__file__).resolve().parent.parent / 'assets'
THEME_ORDER = ('parchment', 'ocean', 'forest', 'plum', 'graphite')
THEME_ALIASES = {'warm': 'parchment', 'blue': 'ocean'}
THEMES = {name: ASSETS / 'themes' / f'{name}.css' for name in THEME_ORDER}
THEME_MARKER = re.compile(r'\A/\* teach:theme:([a-z0-9-]+) \*/$')
KINDS = {'lesson': 'lessons', 'quiz': 'quizzes', 'reference': 'references', 'glossary': 'references', 'resource': 'references', 'topic': 'topics', 'research': 'research'}

SECTION_LABELS = {'lessons': 'Lessons', 'topics': 'Topics', 'quizzes': 'Quizzes', 'references': 'Reference', 'research': 'Research'}

def date_label(value):
    if not value: return 'Undated'
    date = datetime.fromisoformat(value)
    day = date.day
    suffix = 'th' if 10 <= day % 100 <= 20 else {1: 'st', 2: 'nd', 3: 'rd'}.get(day % 10, 'th')
    month = ('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec')[date.month - 1]
    return f'{day}{suffix} {month} {date.year} · {date:%H:%M}'


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
    theme = target / 'theme.css'
    if not theme.exists():
        theme.write_text(compiled_theme('parchment'), encoding='utf-8')
    else:
        existing = theme.read_text(encoding='utf-8')
        marker = theme_marker(existing)
        if marker in (*THEME_ORDER, *THEME_ALIASES):
            selected = canonical_theme(marker)
            generated = compiled_theme(selected)
            if existing != generated:
                theme.write_text(generated, encoding='utf-8')
    return root


def canonical_theme(name):
    return THEME_ALIASES.get(name, name)


def theme_marker(content):
    marker = THEME_MARKER.match(content.splitlines()[0] if content else '')
    return marker.group(1) if marker else None


def compiled_theme(name):
    name = canonical_theme(name)
    if name not in THEMES:
        choices = ', '.join(THEME_ORDER)
        raise ValueError(f'Unknown theme {name!r}; choose one of: {choices}.')
    sections = [
        f'/* teach:theme:{name} */',
        '/* Generated theme bundle. Change the project default through library.py. */',
        f':root {{ --teach-default-palette: {name}; }}',
    ]
    for palette in THEME_ORDER:
        source = THEMES[palette].read_text(encoding='utf-8').rstrip()
        if palette == name:
            selector = f':root[data-palette="{palette}"]'
            source = source.replace(
                selector + ' {',
                f':root:not([data-palette]),\n{selector} {{',
                1,
            )
            dark_selector = selector + '[data-theme="dark"]'
            source = source.replace(
                dark_selector + ' {',
                f':root:not([data-palette])[data-theme="dark"],\n{dark_selector} {{',
                1,
            )
        sections.append(source)
    return '\n\n'.join(sections) + '\n'


def add_theme_link(page):
    content = page.read_text(encoding='utf-8')
    if 'data-teach-theme' in content or re.search(r'href=["\'][^"\']*assets/theme\.css["\']', content):
        return False
    lines = content.splitlines(keepends=True)
    for index, line in enumerate(lines):
        if '<link' not in line or 'stylesheet' not in line or 'assets/index.css' not in line:
            continue
        match = re.search(r'href=(["\'])([^"\']*assets/index\.css)\1', line)
        if not match:
            continue
        indent = line[:len(line) - len(line.lstrip())]
        href = match.group(2).replace('index.css', 'theme.css')
        newline = '\r\n' if line.endswith('\r\n') else '\n'
        lines.insert(index + 1, f'{indent}<link rel="stylesheet" href="{href}" data-teach-theme />{newline}')
        page.write_text(''.join(lines), encoding='utf-8')
        return True
    return False


def set_theme(root, name):
    name = canonical_theme(name)
    if name not in THEMES:
        raise ValueError(f'Unknown theme {name!r}; choose one of: {", ".join(THEME_ORDER)}.')
    root = Path(root)
    destination = root / 'assets/theme.css'
    if destination.exists():
        existing = destination.read_text(encoding='utf-8')
        marker = theme_marker(existing)
        if marker not in (*THEME_ORDER, *THEME_ALIASES):
            raise FileExistsError(f'Custom theme preserved: {destination}')
    root = copy_assets(root)
    existing = destination.read_text(encoding='utf-8')
    selected = compiled_theme(name)
    if existing != selected:
        destination.write_text(selected, encoding='utf-8')
    for page in root.rglob('*.html'):
        add_theme_link(page)
    return destination


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
        self.metadata = {}
    def handle_starttag(self, tag, attrs):
        if tag == 'title': self.inside = True
        if tag == 'meta':
            values = dict(attrs)
            self.metadata[values.get('name')] = values.get('content', '')
    def handle_endtag(self, tag):
        if tag == 'title': self.inside = False
    def handle_data(self, data):
        if self.inside: self.parts.append(data)


def index(root):
    root = copy_assets(root)
    sections = []
    tags = set()
    for folder in SECTION_LABELS:
        entries = []
        pages = sorted((root / folder).glob('*.html'))
        for page in pages:
            if not page.is_file():
                continue
            parser = TitleParser()
            parser.feed(page.read_text(encoding='utf-8'))
            title = ''.join(parser.parts).strip() or page.stem
            created = parser.metadata.get('created', '')
            page_tags = sorted({tag.strip().lower() for tag in parser.metadata.get('tags', '').split(',') if tag.strip()})
            tags.update(page_tags)
            href = quote(page.relative_to(root).as_posix(), safe='/')
            label = date_label(created)
            pills = ''.join(f'<button type="button" class="secondary tag-pill" data-tag="{escape(tag, quote=True)}" aria-pressed="false">{escape(tag)}</button>' for tag in page_tags)
            attrs = f'data-created="{escape(created, quote=True)}" data-title="{escape(title, quote=True)}" data-tags="{escape(",".join(page_tags), quote=True)}"'
            entry = f'<li class="library-entry" {attrs}><a href="{escape(href, quote=True)}">{escape(title)}</a><div class="entry-meta"><time datetime="{escape(created, quote=True)}">{escape(label)}</time><span class="entry-tags">{pills}</span></div></li>'
            entries.append((created, title, entry))
        if not entries: continue
        entries.sort(key=lambda item: (item[0], item[1]), reverse=True)
        filterable = f' data-library-section="{folder}"'
        sections.append(f'<section class="library-section"{filterable}><h2>{SECTION_LABELS[folder]}</h2><ul class="library-entries">' + ''.join(item[2] for item in entries) + '</ul></section>')
    types = '<div class="type-filters" aria-label="Filter by type">' + ''.join(f'<button class="secondary tag-pill" data-type="{kind}" aria-pressed="{str(not kind).lower()}">{label}</button>' for kind, label in [('', 'All types'), *SECTION_LABELS.items()]) + '</div>'
    sort_control = (
        '<div class="library-sort">'
        '<button type="button" class="secondary" id="library-sort" data-sort-value="newest" aria-label="Sort entries" aria-haspopup="menu" aria-expanded="false" aria-controls="library-sort-menu">'
        '<span data-sort-label>Newest first</span><span class="sort-chevron" aria-hidden="true"></span></button>'
        '<div class="library-sort-menu" id="library-sort-menu" data-sort-menu role="menu" hidden>'
        '<button type="button" class="library-sort-option" data-sort-option data-sort-value="newest" role="menuitemradio" aria-checked="true">Newest first</button>'
        '<button type="button" class="library-sort-option" data-sort-option data-sort-value="oldest" role="menuitemradio" aria-checked="false">Oldest first</button>'
        '<button type="button" class="library-sort-option" data-sort-option data-sort-value="title" role="menuitemradio" aria-checked="false">Alphabetical</button>'
        '</div></div>'
    )
    filters = '<div class="library-controls" data-export-ui>' + types + '<div class="tag-filters" aria-label="Filter by tag">'
    filters += '<button class="secondary tag-pill" data-tag="" aria-pressed="true">All tags</button>'
    filters += ''.join(f'<button class="secondary tag-pill" data-tag="{escape(tag, quote=True)}" aria-pressed="false">{escape(tag)}</button>' for tag in sorted(tags))
    filters += '</div><div class="filter-row"><p data-filter-status role="status"></p>' + sort_control + '</div></div>'
    template = (ASSETS / 'templates/index.html').read_text(encoding='utf-8')
    root.mkdir(parents=True, exist_ok=True)
    (root / 'index.html').write_text(template.replace('{{ENTRIES}}', (filters if sections else '<p class="muted">Nothing here yet.</p>') + '\n'.join(sections)), encoding='utf-8')
    return root / 'index.html'


def new(root, kind, slug, title, tags=""):
    if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', slug):
        raise ValueError('Use a lowercase hyphen-separated slug, e.g. queue-backpressure.')
    page_tags = {tag.strip().lower() for tag in tags.split(',') if tag.strip()}
    if kind in ('glossary', 'resource'):
        page_tags.add(kind)
    tags = ','.join(sorted(page_tags))
    root = Path(root)
    page = root / KINDS[kind] / f'{slug}.html'
    if page.exists():
        raise FileExistsError(f'Existing page preserved: {page}')
    init(root)
    page.parent.mkdir(parents=True, exist_ok=True)
    template = (ASSETS / 'templates' / f'{kind}.html').read_text(encoding='utf-8')
    intro = (ASSETS / 'templates/page-intro.html').read_text(encoding='utf-8')
    template = template.replace('{{INTRO}}', intro)
    with page.open('x', encoding='utf-8') as stream:
        created = datetime.now(timezone.utc).replace(microsecond=0)
        stream.write(template.replace('{{TITLE}}', escape(title, quote=True)).replace('{{CREATED}}', created.isoformat()).replace('{{CREATED_LABEL}}', date_label(created.isoformat())).replace('{{TAGS}}', escape(tags, quote=True)))
    index(root)
    return page


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True)
    for command in ('init', 'index'):
        sub.add_parser(command).add_argument('root', type=Path)
    theme = sub.add_parser('theme')
    theme.add_argument('root', type=Path)
    theme.add_argument('name', choices=sorted((*THEME_ORDER, *THEME_ALIASES)))
    create = sub.add_parser('new')
    create.add_argument('root', type=Path)
    create.add_argument('kind', choices=KINDS)
    create.add_argument('slug')
    create.add_argument('--title', required=True)
    create.add_argument('--tags', default='', help='Comma-separated tags; glossary/resource tags are added automatically')
    args = parser.parse_args()
    try:
        if args.command == 'new': result = new(args.root, args.kind, args.slug, args.title, args.tags)
        elif args.command == 'theme': result = set_theme(args.root, args.name)
        elif args.command == 'init': result = init(args.root)
        else: result = index(args.root)
    except (ValueError, OSError) as error:
        parser.exit(1, f'{error}\n')
    print(result.resolve())

if __name__ == '__main__': main()
