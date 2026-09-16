import importlib.util
from pathlib import Path
import tempfile
import unittest

script = Path(__file__).resolve().parents[2] / 'skills/teach/scripts/check_links.py'
spec = importlib.util.spec_from_file_location('links', script)
links = importlib.util.module_from_spec(spec)
spec.loader.exec_module(links)

class LinkTests(unittest.TestCase):
    def test_local_files_fragments_and_duplicates(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root/'target.html').write_text('<h2 id="part">Part</h2>')
            page = root/'index.html'
            page.write_text('<a href="target.html?theme=dark#part">Valid</a><a href="https://example.com">External</a>')
            self.assertEqual(links.check(root), [])
            page.write_text('<b id="twice"></b><i id="twice"></i><a href="missing.html">Missing</a><a href="target.html#absent">Broken</a>')
            errors = links.check(root)
            self.assertEqual(len(errors), 3)
            self.assertTrue(any('duplicate ID' in error for error in errors))
            self.assertTrue(any('missing file' in error for error in errors))
            self.assertTrue(any('missing anchor' in error for error in errors))
