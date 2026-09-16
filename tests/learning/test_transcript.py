import importlib.util
from pathlib import Path
from types import SimpleNamespace
import unittest

SCRIPT = Path(__file__).resolve().parents[2] / 'skills/teach/scripts/transcript.py'
spec = importlib.util.spec_from_file_location('transcript_helper', SCRIPT)
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)


class TranscriptTests(unittest.TestCase):
    def test_supported_urls_and_rejected_hosts(self):
        identifier = 'abcdefghijk'
        for value in [identifier, f'https://youtu.be/{identifier}?t=10',
                      f'https://www.youtube.com/watch?v={identifier}&t=5',
                      f'https://youtube.com/shorts/{identifier}']:
            self.assertEqual(helper.video_id(value), identifier)
        for value in ['https://youtube.com.evil.example/watch?v=abcdefghijk',
                      'https://example.com/abcdefghijk', 'bad-id']:
            with self.assertRaises(ValueError):
                helper.video_id(value)

    def test_timestamped_output_does_not_invent_metadata(self):
        class Captions(list):
            language_code = 'en'
            is_generated = True
        captions = Captions([SimpleNamespace(start=62.9, text='A caption\ncontinued.')])
        output = helper.render(captions, 'abcdefghijk')
        self.assertIn('[00:01:02](https://www.youtube.com/watch?v=abcdefghijk&t=62s)', output)
        self.assertIn('A caption continued.', output)
        self.assertIn('publication date: not retrieved', output)


if __name__ == '__main__':
    unittest.main()
