"""Portable library behavior; run with python -m unittest discover -s tests/learning."""
import importlib.util
from pathlib import Path
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[2] / 'skills/teach/scripts/library.py'
spec = importlib.util.spec_from_file_location('library', SCRIPT)
library = importlib.util.module_from_spec(spec)
spec.loader.exec_module(library)

class LibraryTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name) / 'learning with spaces'

    def test_creation_is_portable_and_escapes_titles(self):
        page = library.new(self.root, 'lesson', 'queues', '<Queues> & "buffers"')
        content = page.read_text()
        self.assertIn('&lt;Queues&gt; &amp; &quot;buffers&quot;', content)
        self.assertIn('href="../index.html"', content)
        self.assertIn('href="../assets/theme.css" data-teach-theme', content)
        self.assertTrue((page.parent / '../assets/index.js').resolve().is_file())
        theme = (self.root / 'assets/theme.css').read_text()
        self.assertTrue(theme.startswith('/* teach:theme:parchment */'))
        self.assertIn('--teach-default-palette: parchment;', theme)
        self.assertIn(':root:not([data-palette])[data-theme="dark"]', theme)
        for palette in library.THEME_ORDER:
            self.assertIn(f':root[data-palette="{palette}"]', theme)
        self.assertIn('href="lessons/queues.html"', (self.root / 'index.html').read_text())
        self.assertNotIn('<Queues>', (self.root / 'index.html').read_text())

    def test_theme_can_be_selected_before_pages_and_switched_globally(self):
        theme = library.set_theme(self.root, 'ocean')
        self.assertEqual(theme, self.root / 'assets/theme.css')
        self.assertIn('--paper: #0d1117;', theme.read_text())
        self.assertIn('--paper-deep: #0b0f14;', theme.read_text())

        first = library.new(self.root, 'lesson', 'queues', 'Queues')
        legacy = self.root / 'references/legacy.html'
        legacy.parent.mkdir(parents=True)
        legacy.write_text('<head>\n  <link rel="stylesheet" href="../assets/index.css" />\n</head>\n<p>Authored</p>')
        library.set_theme(self.root, 'ocean')
        library.set_theme(self.root, 'ocean')

        self.assertEqual(first.read_text().count('data-teach-theme'), 1)
        self.assertEqual(legacy.read_text().count('data-teach-theme'), 1)
        self.assertIn('<p>Authored</p>', legacy.read_text())
        self.assertEqual((self.root / 'index.html').read_text().count('data-teach-theme'), 1)
        self.assertTrue(theme.read_text().startswith('/* teach:theme:ocean */'))
        self.assertIn('--teach-default-palette: ocean;', theme.read_text())

        second = library.new(self.root, 'quiz', 'practice', 'Practice')
        self.assertIn('data-teach-theme', second.read_text())
        self.assertTrue(theme.read_text().startswith('/* teach:theme:ocean */'))

        for palette in library.THEME_ORDER:
            library.set_theme(self.root, palette)
            self.assertTrue(theme.read_text().startswith(f'/* teach:theme:{palette} */'))
            self.assertIn(f'--teach-default-palette: {palette};', theme.read_text())

    def test_legacy_names_and_markers_migrate_to_canonical_palettes(self):
        theme = library.set_theme(self.root, 'blue')
        self.assertTrue(theme.read_text().startswith('/* teach:theme:ocean */'))
        library.set_theme(self.root, 'warm')
        self.assertTrue(theme.read_text().startswith('/* teach:theme:parchment */'))

        theme.write_text('/* teach:theme:blue */\n:root { --paper: old; }\n')
        library.init(self.root)
        migrated = theme.read_text()
        self.assertTrue(migrated.startswith('/* teach:theme:ocean */'))
        self.assertIn('--teach-default-palette: ocean;', migrated)
        self.assertIn(':root[data-palette="graphite"]', migrated)

    def test_unmarked_custom_theme_is_preserved(self):
        assets = self.root / 'assets'
        assets.mkdir(parents=True)
        theme = assets / 'theme.css'
        theme.write_text(':root { --paper: rebeccapurple; }')
        with self.assertRaises(FileExistsError):
            library.set_theme(self.root, 'ocean')
        self.assertEqual(theme.read_text(), ':root { --paper: rebeccapurple; }')

    def test_initialization_preserves_authored_assets_and_pages(self):
        page = library.new(self.root, 'lesson', 'queues', 'Queues')
        page.write_text('authored content')
        css = self.root / 'assets/index.css'
        css.write_text('custom styling')
        library.init(self.root)
        with self.assertRaises(FileExistsError):
            library.new(self.root, 'lesson', 'queues', 'Replacement')
        self.assertEqual(page.read_text(), 'authored content')
        self.assertEqual(css.read_text(), 'custom styling')

    def test_index_reflects_deleted_and_manually_named_pages(self):
        page = library.new(self.root, 'reference', 'old', 'Old')
        page.unlink()
        unusual = page.parent / 'a # & " b.html'
        unusual.write_text('<title>Less &lt; more &amp; safe</title>')
        library.index(self.root)
        content = (self.root / 'index.html').read_text()
        self.assertNotIn('old.html', content)
        self.assertIn('a%20%23%20%26%20%22%20b.html', content)
        self.assertIn('Less &lt; more &amp; safe', content)

    def test_glossary_shares_reference_navigation_and_assets(self):
        page = library.new(self.root, 'glossary', 'glossary', 'My glossary', 'reference, terminology')
        self.assertEqual(page, self.root / 'references/glossary.html')
        content = page.read_text()
        self.assertIn('aria-label="Terms"', content)
        for asset in ('index.css', 'theme.css', 'theme.js', 'index.js', 'vendor/turndown.js'):
            self.assertIn('../assets/' + asset, content)
            self.assertTrue((self.root / 'assets' / asset).is_file())
        index = (self.root / 'index.html').read_text()
        self.assertEqual(index.count('href="references/glossary.html"'), 1)
        self.assertNotIn('<h2>Glossary</h2>', index)
        self.assertIn('<section class="library-section" data-library-section="references"><h2>Reference</h2>', index)
        self.assertIn('data-tag="terminology"', index)
        self.assertFalse((self.root / 'GLOSSARY.md').exists())

    def test_multiple_collections_have_required_tags_and_one_section(self):
        for kind in ('glossary', 'resource'):
            for slug in ('networking', 'storage'):
                page = library.new(self.root, kind, f'{kind}-{slug}', slug,
                                   f' Systems, {kind.upper()}, systems ')
                self.assertIn(f'name="tags" content="{kind},systems"', page.read_text())
                self.assertIn(f'data-page-kind="{kind}"', page.read_text())
        plain = library.new(self.root, 'resource', 'resources', 'Resources')
        self.assertIn('name="tags" content="resource"', plain.read_text())
        library.index(self.root)
        html = (self.root / 'index.html').read_text()
        self.assertEqual(html.count('<h2>Reference</h2>'), 1)
        self.assertEqual(html.count('class="library-entry"'), 5)
        for kind in ('glossary', 'resource'):
            self.assertIn(f'data-tag="{kind}"', html)
        self.assertNotIn('<h2>Glossary</h2>', html)
        self.assertNotIn('<h2>Resource</h2>', html)

    def test_topics_section_tracks_actual_pages_and_preserves_synthesis(self):
        library.index(self.root)
        self.assertNotIn('<h2>Topics</h2>', (self.root / 'index.html').read_text())
        page = library.new(self.root, 'topic', 'queues', 'Understanding queues')
        self.assertEqual(page, self.root / 'topics/queues.html')
        self.assertIn('../assets/index.js', page.read_text())
        self.assertIn('href="topics/queues.html"', (self.root / 'index.html').read_text())
        page.write_text('<title>My queue model</title><main>Authored synthesis</main>')
        library.index(self.root)
        self.assertIn('Authored synthesis', page.read_text())
        self.assertIn('My queue model', (self.root / 'index.html').read_text())
        page.unlink()
        library.index(self.root)
        self.assertNotIn('<h2>Topics</h2>', (self.root / 'index.html').read_text())

    def test_research_has_its_own_final_section_and_template(self):
        library.new(self.root, 'reference', 'decision-aid', 'Decision aid')
        page = library.new(self.root, 'research', 'retry-ownership', 'Where should retries live?',
                           'architecture, evidence')
        self.assertEqual(page, self.root / 'research/retry-ownership.html')
        content = page.read_text()
        self.assertIn('data-page-kind="research"', content)
        for section in ('scope', 'findings', 'implications', 'sources', 'limitations'):
            self.assertIn(f'id="{section}"', content)
        index = (self.root / 'index.html').read_text()
        self.assertIn('href="research/retry-ownership.html"', index)
        self.assertIn('data-type="research"', index)
        self.assertLess(index.index('<h2>Reference</h2>'), index.index('<h2>Research</h2>'))
        page.unlink()
        library.index(self.root)
        self.assertNotIn('<h2>Research</h2>', (self.root / 'index.html').read_text())

    def test_metadata_and_newest_order_are_preserved(self):
        older = library.new(self.root, 'lesson', 'older', 'Older', 'queues, systems')
        newer = library.new(self.root, 'lesson', 'newer', 'Newer', 'reliability')
        import re
        for page, date in ((older, '2025-01-01T10:00:00+00:00'), (newer, '2026-01-01T10:00:00+00:00')):
            content = page.read_text()
            self.assertNotIn('{{CREATED', content)
            self.assertIn('<time datetime=', content)
            page.write_text(re.sub(r'name="created" content="[^"]+"', f'name="created" content="{date}"', content))
        library.index(self.root)
        html = (self.root / 'index.html').read_text()
        self.assertLess(html.index('href="lessons/newer.html"'), html.index('href="lessons/older.html"'))
        self.assertIn('data-tag="queues"', html)
        self.assertIn('</div><div class="filter-row"><p data-filter-status role="status"></p><div class="library-sort">', html)
        self.assertIn('id="library-sort" data-sort-value="newest"', html)
        self.assertNotIn('<h2>Quizzes</h2>', html)
        self.assertIn('2025-01-01T10:00:00+00:00', older.read_text())

    def test_slug_cannot_escape_library(self):
        for slug in ('../escape', '/absolute', 'two words', 'a/b', ''):
            with self.subTest(slug=slug), self.assertRaises(ValueError):
                library.new(self.root, 'quiz', slug, 'Title')
        self.assertFalse(self.root.exists())

    def test_index_alone_creates_a_usable_empty_library(self):
        page = library.index(self.root)
        self.assertTrue(page.is_file())
        self.assertTrue((self.root / 'assets/index.css').is_file())
        self.assertTrue((self.root / 'assets/theme.css').is_file())
        self.assertIn('Nothing here yet.', page.read_text())

if __name__ == '__main__': unittest.main()
