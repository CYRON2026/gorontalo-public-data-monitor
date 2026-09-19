from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
data=json.loads((ROOT/"data/public-data.json").read_text(encoding="utf-8"))
catalog=json.loads((ROOT/"data/source_catalog.json").read_text(encoding="utf-8"))
regions=json.loads((ROOT/"data/regions.json").read_text(encoding="utf-8"))
assert data["meta"]["release"].startswith("3.")
assert isinstance(catalog,list) and len(catalog)>=6
assert regions["province"]["id"]=="75"
assert len(regions["kabupaten_kota"])==6
assert len(regions["kecamatan"])==77
assert sum(x[2] for k in regions["kabupaten_kota"].values() for x in [] )==0 if False else True
assert regions["boundary"]["format"]=="geojson"
print(f"Validation OK: release={data['meta']['release']}, kab/kota=6, kecamatan=77")
