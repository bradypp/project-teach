import importlib.util
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


SCRIPT = Path(__file__).resolve().parents[2] / 'skills/teach/scripts/check_content.py'
spec = importlib.util.spec_from_file_location('content', SCRIPT)
content = importlib.util.module_from_spec(spec)
spec.loader.exec_module(content)


class ContentTests(unittest.TestCase):
    def test_diagram_class_requires_figure(self):
        with tempfile.TemporaryDirectory() as directory:
            page = Path(directory) / 'lesson.html'
            page.write_text('''<figure class="diagram wide"></figure>
<div class="diagram-view"></div>
<div class="wide diagram">Wrong</div>
<section class=diagram>Also wrong</section>
''')
            self.assertEqual(content.check(page), [
                f'{page}:3: "diagram" class must be on a <figure> (found <div>)',
                f'{page}:4: "diagram" class must be on a <figure> (found <section>)',
            ])

    def test_directory_checks_authored_pages_and_cli_exit(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'lessons').mkdir()
            (root / 'assets').mkdir()
            (root / 'assets' / 'template.html').write_text('<div class="diagram"></div>')
            page = root / 'lessons' / 'lesson.html'
            page.write_text('<figure class="diagram"><pre class="mermaid"></pre></figure>')
            self.assertEqual(content.check(root), [])
            result = subprocess.run([sys.executable, str(SCRIPT), str(root)], capture_output=True, text=True)
            self.assertEqual(result.returncode, 0)
            self.assertIn('HTML content checks pass.', result.stdout)

            page.write_text('<div class="diagram"><pre class="mermaid"></pre></div>')
            result = subprocess.run([sys.executable, str(SCRIPT), str(root)], capture_output=True, text=True)
            self.assertEqual(result.returncode, 1)
            self.assertIn(f'{page}:1:', result.stdout)
            self.assertIn('"diagram" class must be on a <figure>', result.stdout)
            self.assertIn('pre.mermaid must be inside a <figure class="diagram">', result.stdout)

    def test_mermaid_source_requires_diagram_figure_ancestor(self):
        with tempfile.TemporaryDirectory() as directory:
            page = Path(directory) / 'lesson.html'
            page.write_text('''<figure class="diagram"><div><pre class="mermaid"></pre></div></figure>
<img src="illustration.png">
<pre class="mermaid">Outside</pre>
<figure><pre class="mermaid">Missing diagram class</pre></figure>
<figure class="diagram"><pre class="language-mermaid">Code sample</pre></figure>
''')
            self.assertEqual(content.check(page), [
                f'{page}:3: pre.mermaid must be inside a <figure class="diagram">',
                f'{page}:4: pre.mermaid must be inside a <figure class="diagram">',
            ])


if __name__ == '__main__':
    unittest.main()
