"""
V2 source catalog validator.
This script is intentionally conservative: it validates the local snapshot and
prints source URLs. Live ingestion is a separate step after each source's
structured export/API endpoint is verified.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT/"data/v2-data.json").read_text(encoding="utf-8"))
sources = json.loads((ROOT/"data/source_catalog.json").read_text(encoding="utf-8"))

assert data["meta"]["version"] == "V2-real-data-snapshot"
assert len(data["regions"]) == 6
assert data["open_data_preview"]["rows_total"] == 11
assert len(data["open_data_preview"]["rows_preview"]) == 10
assert len(sources) == 6

print("V2 snapshot validation: OK")
print("Regions:", len(data["regions"]))
print("Open Data preview rows:", len(data["open_data_preview"]["rows_preview"]))
print("Sources:", len(sources))
for s in sources:
    print("-", s["name"], "=>", s["url"])
