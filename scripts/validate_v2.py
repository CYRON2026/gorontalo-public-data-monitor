import json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
for name in ["v2.1-data.json","source_catalog.json"]:
    json.loads((root/"data"/name).read_text(encoding="utf-8"))
print("Legacy-compatible validation OK")
