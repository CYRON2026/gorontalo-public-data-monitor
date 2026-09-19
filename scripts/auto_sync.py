import json, re, urllib.request, datetime
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"data/auto_sync_status.json"
SOURCES={
  "open_data_home":"https://opendata.gorontaloprov.go.id/",
  "djpk_apbd_2026":"https://djpk.kemenkeu.go.id/portal/data/apbd?pemda=00&provinsi=30&tahun=2026",
}
status={"checked_at":datetime.datetime.now(datetime.timezone.utc).isoformat(),"results":{}}
for name,url in SOURCES.items():
    try:
        req=urllib.request.Request(url,headers={"User-Agent":"Gorontalo-Public-Data-Monitor/2.2"})
        with urllib.request.urlopen(req,timeout=25) as r:
            body=r.read().decode("utf-8","ignore")
        status["results"][name]={"ok":True,"http_status":200,"bytes":len(body)}
        if name=="open_data_home":
            m=re.search(r"(\d+)\s*Dataset",body,re.I)
            if m: status["results"][name]["dataset_count_detected"]=int(m.group(1))
    except Exception as e:
        status["results"][name]={"ok":False,"error":type(e).__name__+": "+str(e)}

OUT.write_text(json.dumps(status,ensure_ascii=False,indent=2),encoding="utf-8")
print(json.dumps(status,ensure_ascii=False))
