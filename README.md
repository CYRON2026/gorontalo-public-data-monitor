# Data Publik Gorontalo

Dashboard statis untuk menelusuri data publik Provinsi Gorontalo dengan sumber yang dapat dibuka ulang.

## V3.2

V3.2 mengubah pola aplikasi menjadi dua lapis:

1. **Dashboard utama** — angka inti, peta, pencarian, sinyal review, dan daftar sumber.
2. **Sub-web wilayah** — `region.html?level=...&id=...` untuk detail provinsi, kabupaten/kota, kecamatan, dan desa/kelurahan.

Tujuannya supaya dashboard utama tetap ringan, sementara detail wilayah dapat menampung hierarchy, data keuangan yang benar-benar scoped, dataset sektoral, dan tautan sumber asli.

## Aturan data

- Data berasal dari sumber publik.
- Angka parent tidak disalin ke child geography.
- Dataset yang hanya sampai kabupaten/kota tidak diperlakukan sebagai data kecamatan/desa.
- Sinyal review adalah petunjuk pemeriksaan, bukan tuduhan pelanggaran.
- Ketiadaan record lokal bukan bukti bahwa kegiatan tidak ada.

## Struktur

- `index.html` — dashboard utama
- `region.html` + `region.js` — sub-web detail wilayah
- `app.js` — dashboard/map/search
- `styles.css` — dark responsive UI
- `data/public-data.json` — snapshot fiskal dan indikator
- `data/regions.json` — hierarchy wilayah
- `data/datasets.json` — katalog dataset relevan
- `data/source_catalog.json` — sumber publik
- `scripts/validate.py` — pemeriksaan struktur
- `scripts/collector.py` — manifest collector aman
- `scripts/auto_sync.py` — safe sync tanpa overwrite destruktif

## Deployment

Bisa di-host di GitHub Pages karena tidak membutuhkan backend untuk dashboard dasar. Peta memakai Leaflet dan sumber boundary publik. Jika boundary eksternal gagal, aplikasi otomatis memakai fallback titik kabupaten/kota dan fungsi detail wilayah tetap berjalan.
