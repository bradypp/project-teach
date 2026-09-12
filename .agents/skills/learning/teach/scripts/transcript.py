#!/usr/bin/env python3
"""Optional YouTube captions helper; emits timestamped Markdown to stdout.

Requires youtube-transcript-api installation: https://github.com/jdepoix/youtube-transcript-api
No cache or learning-state writes. Video metadata is not inferred from captions.
"""
import argparse
import re
import sys
from urllib.parse import parse_qs, urlparse


def video_id(value):
    if re.fullmatch(r"[A-Za-z0-9_-]{11}", value):
        return value
    parsed = urlparse(value)
    if parsed.scheme not in ("https", "http"):
        raise ValueError("Supply a YouTube URL or an 11-character video ID.")
    host = (parsed.hostname or "").lower()
    parts = parsed.path.strip("/").split("/")
    if host in ("youtu.be", "www.youtu.be"):
        candidate = parts[0]
    elif host in ("youtube.com", "www.youtube.com", "m.youtube.com"):
        if parsed.path == "/watch":
            candidate = parse_qs(parsed.query).get("v", [""])[0]
        elif len(parts) == 2 and parts[0] in ("shorts", "embed", "live"):
            candidate = parts[1]
        else:
            candidate = ""
    else:
        candidate = ""
    if not re.fullmatch(r"[A-Za-z0-9_-]{11}", candidate):
        raise ValueError("Could not identify a valid YouTube video ID.")
    return candidate


def render(transcript, identifier):
    url = f"https://www.youtube.com/watch?v={identifier}"
    lines = ["# Video transcript", "", f"Source: {url}",
             f"Language: {transcript.language_code}",
             f"Automatically generated: {transcript.is_generated}",
             "Title, channel and publication date: not retrieved.", ""]
    for segment in transcript:
        seconds = max(0, int(segment.start))
        stamp = f"{seconds // 3600:02}:{seconds // 60 % 60:02}:{seconds % 60:02}"
        text = " ".join(segment.text.split())
        lines.append(f"[{stamp}]({url}&t={seconds}s) {text}")
    return "\n".join(lines) + "\n"


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("video", help="YouTube URL or video ID")
    parser.add_argument("--languages", nargs="+", default=["en"], help="Preferred language codes")
    args = parser.parse_args(argv)
    try:
        identifier = video_id(args.video)
    except ValueError as error:
        parser.error(str(error))
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
    except ImportError:
        print("Optional dependency unavailable: youtube-transcript-api. Use supplied captions or another source; see research.md.", file=sys.stderr)
        return 2
    try:
        transcript = YouTubeTranscriptApi().fetch(identifier, languages=args.languages)
    except Exception as error:
        print(f"Transcript unavailable ({type(error).__name__}). Use supplied captions or another source.", file=sys.stderr)
        return 1
    print(render(transcript, identifier), end="")
    return 0


if __name__ == "__main__":
    sys.exit(main())
