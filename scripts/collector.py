"""Refresh the public source catalog from config/sources.json.

This is a catalog/status scaffold only. It does not fabricate or replace
financial/procurement records. Actual dataset collectors can be added later
for sources that expose a stable public file/API endpoint.
"""
import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
config = json.loads((ROOT / "config/sources.json").read_text(encoding="utf-8"))
now = datetime.now(timezone.utc).isoformat()

catalog = []
for source in config.get("sources", []):
    catalog.append({
        "id": source["name"].lower().replace(" ", "-").replace("/", "-"),
        "name": source["name"],
        "url": source["url"],
        "type": "public source",
        "checked_at": now,
        "status": "cataloged",
        "notes": source.get("notes", "")
    })

out = ROOT / "data/source_catalog.json"
out.write_text(json.dumps(catalog, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Wrote {out} ({len(catalog)} sources)")
