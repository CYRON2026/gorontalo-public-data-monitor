# Gorontalo Public Data Monitor

Prototype gratis untuk mengeksplorasi data publik Gorontalo.

## Isi prototype
- Dashboard KPI.
- Filter tahun, level wilayah, dan wilayah.
- Peta interaktif.
- Tabel pengadaan.
- Status analisis: Normal / Perlu Ditinjau / Anomali Harga / Tidak Cukup Data.
- Katalog awal sumber publik.
- Struktur awal untuk otomasi data.

**Penting:** `data/sample.json` berisi DATA CONTOH, bukan data resmi.

## Cara menjalankan di HP/PC
Paling mudah untuk uji cepat:
1. Upload seluruh folder ke GitHub.
2. Aktifkan GitHub Pages.
3. Buka URL Pages yang diberikan GitHub.

Atau secara lokal dengan Python:
```bash
python -m http.server 8000
```
Lalu buka `http://localhost:8000`.

## Roadmap produksi
1. Inventaris dataset Open Data Gorontalo.
2. Buat collector untuk CSV/XLSX/JSON.
3. Simpan raw file + metadata sumber.
4. Normalisasi APBD, RUP, pengadaan, vendor, wilayah.
5. Tambahkan Postgres/PostGIS atau data store gratis yang sesuai.
6. Buat benchmark harga berbasis tanggal dan spesifikasi.
7. Tambahkan audit trail: sumber -> record -> analisis -> dashboard.
8. Tambahkan scheduled GitHub Actions untuk sinkronisasi dataset publik.
9. Tambahkan GeoJSON batas administrasi resmi.
10. Tambahkan model statistik/AI yang explainable.

## Prinsip analisis
Sistem hanya menghasilkan indikasi untuk ditinjau. Anomali harga tidak otomatis berarti pelanggaran, korupsi, atau tindak pidana. Semua flag harus dapat ditelusuri ke data publik dan metode yang digunakan.
