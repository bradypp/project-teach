#!/usr/bin/env python3
"""Copy the five learning skills to a supplied skill directory, without overwriting."""
import argparse
from pathlib import Path
import shutil


def install(destination):
    source = Path(__file__).resolve().parents[1] / '.agents/skills/learning'
    skills = sorted(path for path in source.iterdir() if (path / 'SKILL.md').is_file())
    destination = Path(destination).expanduser().resolve()
    conflicts = [destination / skill.name for skill in skills if (destination / skill.name).exists()]
    if conflicts:
        raise FileExistsError('Existing skills preserved: ' + ', '.join(map(str, conflicts)))
    destination.mkdir(parents=True, exist_ok=True)
    for skill in skills:
        shutil.copytree(skill, destination / skill.name,
                        ignore=shutil.ignore_patterns('__pycache__', '*.pyc'))
    return [destination / skill.name for skill in skills]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('destination', type=Path, help='Destination skill directory; all five skills remain siblings')
    args = parser.parse_args()
    try:
        for path in install(args.destination):
            print(path)
    except OSError as error:
        parser.exit(1, f'{error}\n')


if __name__ == '__main__':
    main()
