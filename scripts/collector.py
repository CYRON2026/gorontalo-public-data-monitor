# Kerangka collector. Jangan menganggap semua portal memiliki API.
# Mulai dari URL yang memang menyediakan file/API publik dan hormati robots.txt,
# rate limit, Terms of Service, serta atribusi sumber.

import json
from pathlib import Path
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[1]
sources = json.loads((ROOT / "config/sources.json").read_text(encoding="utf-8"))

catalog = []
for s in sources["sources"]:
    catalog.append({
        "name": s["name"],
        "url": s["url"],
        "checked_at": datetime.now(timezone.utc).isoformat(),
        "status": "pending_connector",
        "notes": s.get("notes","")
    })

out = ROOT / "data/source_catalog.json"
out.write_text(json.dumps({"generated_at":datetime.now(timezone.utc).isoformat(),"sources":catalog},indent=2,ensure_ascii=False),encoding="utf-8")
print(f"Wrote {out}")
