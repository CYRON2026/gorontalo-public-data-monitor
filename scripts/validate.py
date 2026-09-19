from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / 'data' / 'public-data.json').read_text(encoding='utf-8'))
catalog = json.loads((ROOT / 'data' / 'source_catalog.json').read_text(encoding='utf-8'))
assert isinstance(data, dict)
assert isinstance(catalog, list)
assert data.get('meta', {}).get('release') == '2.2.2'
assert len(data.get('sources', [])) >= 6
assert len(catalog) >= 6
print('Validation OK')
