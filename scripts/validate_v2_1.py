import json
from pathlib import Path

root=Path(__file__).resolve().parents[1]
p=root/"data/v2.1-data.json"
d=json.loads(p.read_text(encoding="utf-8"))
assert d["meta"]["version"]=="V2.1-2026"
assert len(d["regions"])==6
assert d["province"]["apbd_history"]["2026"]["initial"]["belanja"]["total"]>0
assert d["province"]["tkdd_2024"]["budget_million"]>0
print("V2.1 validation OK")
