"""Safe collector placeholder for public sources.
The V3.2 release keeps verified snapshots intact and never overwrites data on fetch failure.
"""
from pathlib import Path
import json

ROOT=Path(__file__).resolve().parents[1]
CATALOG=ROOT/'data/source_catalog.json'

def main():
    sources=json.loads(CATALOG.read_text(encoding='utf-8'))
    print(f"Collector manifest ready: {len(sources)} public sources. No destructive overwrite performed.")

if __name__=='__main__':
    main()
