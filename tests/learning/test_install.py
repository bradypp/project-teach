import importlib.util
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('learning_install', ROOT / 'scripts/install.py')
installer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(installer)


class InstallTests(unittest.TestCase):
    def test_portable_bundle_and_references_survive_relocation(self):
        with tempfile.TemporaryDirectory() as directory:
            destination = Path(directory) / 'new-project/skills'
            paths = installer.install(destination)
            self.assertEqual(len(paths), 5)
            self.assertTrue((destination / 'teach-setup/../teach/references/learning-system.md').is_file())
            self.assertTrue((destination / 'teach/references/visual-language.md').is_file())
            self.assertTrue((destination / 'teach/assets/templates/lesson.html').is_file())
            self.assertTrue((destination / 'teach-quiz/agents/openai.yaml').is_file())
            self.assertFalse((destination / 'productivity').exists())

    def test_existing_skill_aborts_before_copying_anything(self):
        with tempfile.TemporaryDirectory() as directory:
            destination = Path(directory)
            existing = destination / 'teach'
            existing.mkdir()
            (existing / 'SKILL.md').write_text('Personal customisation')
            with self.assertRaises(FileExistsError):
                installer.install(destination)
            self.assertEqual(list(destination.iterdir()), [existing])
            self.assertEqual((existing / 'SKILL.md').read_text(), 'Personal customisation')


if __name__ == '__main__':
    unittest.main()
