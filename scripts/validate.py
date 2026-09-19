from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]

def load(name):
    return json.loads((ROOT / name).read_text(encoding='utf-8'))

data = load('data/public-data.json')
regions = load('data/regions.json')
datasets = load('data/datasets.json')
sources = load('data/source_catalog.json')

assert data['meta']['release'] == '3.2.0'
assert regions['meta']['schema_version'] == '3.2'
assert len(regions['kabupaten_kota']) == 6
assert len(regions['kecamatan']) == 77
assert isinstance(datasets, list) and len(datasets) >= 8
assert isinstance(sources, list) and len(sources) >= 6
assert regions['province']['id'] == '75'
assert regions['boundary']['format'] == 'geojson'
for kid, kec in regions['kecamatan'].items():
    assert kec['parent_id'] in regions['kabupaten_kota'], kid
for kid, kab in regions['kabupaten_kota'].items():
    children = [k for k,v in regions['kecamatan'].items() if v['parent_id'] == kid]
    assert len(children) == len(kab['children']), kid
for d in datasets:
    assert all(k in d for k in ('id','title','category','depth','owner','url','relevant_keywords'))

print(f"VALIDATION OK: release={data['meta']['release']}; kab/kota=6; kecamatan=77; datasets={len(datasets)}")
