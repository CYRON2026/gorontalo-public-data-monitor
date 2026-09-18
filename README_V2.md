# Gorontalo Public Data Monitor — V2 Real Data

## Apa yang berubah
V2 sekarang menggunakan snapshot data publik nyata dari sumber resmi:
- DJPK/SIKD TKDD 2024 untuk 6 kabupaten/kota di Gorontalo.
- DJPK/SIKD APBD Provinsi Gorontalo 2022 sebagai snapshot historis.
- Open Data Gorontalo dataset PAD 2024 (preview 10 dari 11 baris yang tampil).
- BPS Master File Desa Gorontalo 2025 sebagai referensi wilayah.
- LKPP PTPEP sebagai sumber pengadaan yang sudah diverifikasi, tetapi package-level import belum di-hard-code sebelum endpoint/export terstruktur terverifikasi.

## IMPORTANT: jangan mengarang data
Angka yang ditampilkan diberi periode dan sumber. V2 tidak mengklaim angka 2022 sebagai APBD 2026.

## Cara memasang ke GitHub Pages

### REPLACE
Ganti file lama:
1. `index.html`
2. `styles.css`
3. `app.js`

### ADD
Tambahkan:
1. `data/v2-data.json`
2. `data/source_catalog.json`

### LEAVE UNCHANGED
Folder/file lain yang sudah ada boleh tetap.

### DELETE
Tidak ada file yang perlu dihapus.

Setelah commit, tunggu GitHub Pages selesai deploy lalu hard refresh.

## Catatan
V2 belum menggunakan polygon batas administrasi asli. Itu target V3.
V2 juga belum melakukan live scraping/API sync. Data saat ini adalah snapshot yang diverifikasi dari halaman publik pada 18 September 2026.

## Sumber
- https://opendata.gorontaloprov.go.id/dataset
- https://opendata.gorontaloprov.go.id/dataset-detail/114
- https://djpk.kemenkeu.go.id/portal/data/apbd
- https://djpk.kemenkeu.go.id/portal/data/tkdd
- https://ptpep.lkpp.go.id/laporan/dashboard-klpd
- https://gorontalo.bps.go.id/id/publication/2026/03/31/fff77cc651cc3a5df7ba7dbd/master-file-desa-provinsi-gorontalo-2025.html
