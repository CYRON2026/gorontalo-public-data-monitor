# Gorontalo Public Data Monitor

## V3.1 — Geographic hierarchy & administrative map

V3 mempertahankan data publik terverifikasi dari baseline V2 dan menambahkan fondasi geografis yang dapat dipakai untuk pengembangan berikutnya.

### Yang berubah
- `data/public-data.json` tetap menjadi data utama.
- `data/regions.json` menjadi referensi hierarchy: Provinsi → 6 Kabupaten/Kota → 77 Kecamatan.
- Peta sekarang menggunakan polygon administrasi desa/kelurahan dari feature service 2025 dan mengelompokkannya berdasarkan kode parent untuk tampilan kecamatan/kabupaten/provinsi.
- Level Desa/Kelurahan mengambil nama, kode, dan polygon dari service publik; tidak ada nama wilayah yang ditebak.
- Filter wilayah berubah mengikuti level yang dipilih.
- Klik polygon membuka identitas wilayah dan parent hierarchy.
- Data fiskal V2 tidak dinaikkan/diturunkan secara paksa ke desa. V3 hanya menyediakan konteks geografis; agregasi ke level bawah menunggu data yang benar-benar punya geographic scope.

### Sumber geografis
BPS Provinsi Gorontalo, *Master File Desa Provinsi Gorontalo 2025* (revisi 16 September 2026) digunakan untuk struktur kode/nama hierarchy. Polygon desa/kelurahan menggunakan feature service administrasi Semester 1 2025 yang mendokumentasikan pemutakhiran batas definitif dan sinkronisasi kode wilayah.

### Prinsip keamanan data
- Tidak ada angka fiskal baru yang dibuat dari geometri.
- Parent total tidak disalin ke child.
- Tidak ada klaim bahwa polygon adalah bukti status hukum batas jika sumber menandai batas indikatif/belum ditegaskan.
- Jika service batas gagal diakses, UI menampilkan status kegagalan dan mempertahankan data snapshot; tidak membuat polygon palsu.
- V3 belum mengaktifkan anomaly/AI engine atau procurement package fabrication.

### Struktur stabil
`index.html`, `styles.css`, `app.js`, `data/public-data.json`, `data/source_catalog.json`, `data/regions.json`, `scripts/validate.py`, `scripts/auto_sync.py`, `scripts/collector.py`, `README.md`, dan `INSTALL.txt` tetap memakai nama file stabil. Nomor release disimpan di metadata internal.


## V3.1
- Mempertahankan identitas UI gelap sebagai baseline awal maturity.
- Memperbaiki kontrol per-lokasi di bawah peta.
- Menambahkan location explorer: metadata wilayah, data scoped bila tersedia, dan drill-down child region.
- Klik polygon kini memilih lokasi dan menyinkronkan kontrol wilayah.
- Level kecamatan/desa tidak diisi angka fiskal tanpa sumber dengan geographic scope yang sesuai.
- Internal release: 3.1.0.
