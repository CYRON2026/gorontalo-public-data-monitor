import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
data=json.loads((ROOT/"data/v2.1-data.json").read_text(encoding="utf-8"))
assert data["meta"]["version"].startswith("V2.2")
assert len(data.get("regions", [])) == 6, "Expected 6 Gorontalo kab/kota regions"
assert len(data.get("sources", [])) >= 6, "Source catalog unexpectedly small"
assert data["province"]["apbd_history"]["2026"]["initial"]["belanja"]["total"] > 0
assert data["province"]["tkdd_2024"]["budget_million"] > 0
assert "live_context" in data
print("V2.2 validation OK")
