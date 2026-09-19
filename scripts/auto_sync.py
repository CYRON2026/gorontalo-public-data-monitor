"""Non-destructive sync entry point.
Actual source-specific ETL is intentionally separated from the verified snapshot.
"""
from pathlib import Path
import json
from datetime import datetime, timezone

ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'data/public-data.json'
STATUS=ROOT/'data/auto_sync_status.json'

def main():
    data=json.loads(DATA.read_text(encoding='utf-8'))
    status={
        'checked_at':datetime.now(timezone.utc).isoformat(),
        'mode':'safe',
        'release':data['meta']['release'],
        'result':'no-overwrite',
        'note':'V3.2 keeps verified snapshot unless a source-specific collector passes validation.'
    }
    STATUS.write_text(json.dumps(status,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('Auto-sync safe mode: verified snapshot preserved.')

if __name__=='__main__':main()
