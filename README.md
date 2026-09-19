# Gorontalo Public Data Monitor

## Baseline V2.2.2 — Early Maturity

V2.2.2 adalah baseline bersih setelah fase beta/eksperimental. Fokus release ini adalah stabilitas struktur file, validasi, sumber data publik, dan kompatibilitas untuk pengembangan berikutnya.

### Aturan struktur mulai release ini

- `data/public-data.json` adalah file data utama yang dibaca website dan **nama file dipertahankan** pada setiap upgrade.
- `data/source_catalog.json` adalah katalog sumber dan memakai nama tetap.
- `scripts/validate.py` adalah validator utama dan memakai nama tetap.
- `scripts/auto_sync.py` menangani pemeriksaan sumber berkala dengan mode aman.
- `scripts/collector.py` dipertahankan untuk katalog sumber.
- `README.md` adalah dokumentasi utama dan **selalu diperbarui isinya**, bukan dibuat sebagai `README versi.md` baru.
- `INSTALL.txt` adalah panduan instalasi/replace dan juga memakai nama tetap.
- Nomor release adalah metadata internal; tampilan publik menggunakan judul `Data Publik Gorontalo`, bukan nomor versi.

### Prinsip upgrade

Setiap release berikutnya mengganti **isi file yang sama**, bukan membuat rangkaian file `v3-data.json`, `v4-data.json`, dan seterusnya. File lama yang sudah tidak dipakai harus dihapus agar tidak ada sumber data ganda yang membingungkan.

### Batasan saat ini

- Snapshot masih menggunakan data publik yang tersedia; belum menjadi live database.
- Peta masih menggunakan titik pusat wilayah.
- Data pengadaan package-level belum diimpor jika belum tersedia/terverifikasi dalam sumber publik.
- AI/anomaly engine belum digunakan pada baseline ini.

### Roadmap

Baseline V2.2.2 → pengembangan geografis/polygon → linkage APBD/RUP/PBJ → historical tracking → benchmark harga → analisis anomali berbantuan AI → public audit trail.

Data anomali hanya merupakan sinyal untuk ditinjau, bukan bukti pelanggaran.
