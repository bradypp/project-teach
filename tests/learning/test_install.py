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
            integrations = destination / 'teach/references/integrations.md'
            self.assertTrue(integrations.is_file())
            integration_text = integrations.read_text()
            self.assertEqual(integration_text.count('<!-- teach:execution:inline -->'), 1)
            self.assertEqual(integration_text.count('<!-- teach:execution:background -->'), 1)
            self.assertTrue((destination / 'teach/assets/templates/lesson.html').is_file())
            self.assertTrue((destination / 'teach/references/templates/PREFERENCES.md').is_file())
            wrapper = destination / 'teach/references/templates/wrapper.md'
            self.assertTrue(wrapper.is_file())
            wrapper_text = wrapper.read_text()
            self.assertEqual(wrapper_text.count('<!-- teach:integration:start -->'), 1)
            self.assertEqual(wrapper_text.count('<!-- teach:integration:end -->'), 1)
            self.assertEqual(wrapper_text.count('<!-- teach:execution:{{inline|background}} -->'), 1)
            # New component assets remain available from an installed bundle.
            for name in ('multi-step-question', 'scenario-question', 'visual-experiment', 'resource', 'research'):
                self.assertTrue((destination / f'teach/assets/templates/{name}.html').is_file())
            self.assertFalse((destination / 'teach/references/templates/research.md').exists())
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
