"""Portable library behavior; run with python -m unittest discover -s tests/learning."""
import importlib.util
from pathlib import Path
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[2] / '.agents/skills/learning/teach/scripts/library.py'
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
        self.assertTrue((page.parent / '../assets/index.js').resolve().is_file())
        self.assertIn('href="lessons/queues.html"', (self.root / 'index.html').read_text())
        self.assertNotIn('<Queues>', (self.root / 'index.html').read_text())

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

    def test_slug_cannot_escape_library(self):
        for slug in ('../escape', '/absolute', 'two words', 'a/b', ''):
            with self.subTest(slug=slug), self.assertRaises(ValueError):
                library.new(self.root, 'quiz', slug, 'Title')
        self.assertFalse(self.root.exists())

    def test_index_alone_creates_a_usable_empty_library(self):
        page = library.index(self.root)
        self.assertTrue(page.is_file())
        self.assertTrue((self.root / 'assets/index.css').is_file())
        self.assertIn('Nothing here yet.', page.read_text())

if __name__ == '__main__': unittest.main()
