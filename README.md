# e-HUNTAP VERIKOST
### Sistem Digitalisasi Verifikasi Biaya Riil & Instrumen Audit Pengadaan Darurat Hunian Tetap (Huntap)
**Kementerian Perumahan dan Kawasan Permukiman (Kementerian PKP) Republik Indonesia**  
*Paket Penanganan Bencana: Pembangunan 40 Unit Huntap di Aceh Tenggara*  
*Dasar Regulasi: Peraturan LKPP No. 6 Tahun 2024 (PBJ Darurat - Kontrak Biaya Plus Imbalan) jo. Peraturan LKPP No. 5 Tahun 2022*

---

## 🎯 Latar Belakang & Solusi
Dalam pelaksanaan kontrak penanganan darurat dengan jenis **Biaya Plus Imbalan (*Cost Plus Fee*)**, kendala operasional dan risiko audit hukum terbesar adalah:
1. **Verifikasi Manual Ribuan Berkas**: Tumpukan nota material, kuitansi upah pekerja, faktur solar/alat berat, dan surat jalan memakan waktu berminggu-minggu.
2. **Risiko Audit APIP/BPK/BPKP**: Ancaman tuduhan *markup* harga riil, SPJ fiktif, atau *double-claim* (satu nota diajukan berulang).
3. **Keterlambatan Pembayaran**: Pengembang terlambat menerima penggantian (*reimbursement*), sehingga mengancam kecepatan pembangunan hunian bagi korban bencana.

Aplikasi **e-HUNTAP VERIKOST** ini dibangun untuk menjawab arahan pimpinan dalam mendigitalisasi instrumen verifikasi dan *checklist* audit secara *end-to-end*, terintegrasi, transparan, dan akuntabel.

---

## 🚀 Fitur Unggulan Sistem

### 1. Simulasi Multi-Peran (4 Persona Akses)
Tersedia pemilih peran instan di pojok kanan atas aplikasi untuk kebutuhan presentasi dan demonstrasi:
* 🏢 **Mode 1: Pengembang (Penyedia Terpilih)**  
  Menginput bukti transaksi riil, mengunggah faktur/nota/absensi upah, dan memantau status persetujuan klaim termin. Dilengkapi validasi **Anti Double-Claim** (sistem menolak jika nomor faktur sudah pernah didaftarkan).
* 👷 **Mode 2: Tim Teknis Kementerian PKP (Verifikator)**  
  Instrumen pengujian **3 Pilar**:
  * **Pilar 1 (Administrasi)**: Keabsahan faktur, stempel cap basah toko/NPWP, kuitansi bermeterai.
  * **Pilar 2 (Spek Teknis)**: Kepatuhan spesifikasi modul panel beton tahan gempa RISHA/RUSPIN dan material SNI.
  * **Pilar 3 (Opname Fisik)**: Pengecekan volume terpasang nyata di lokasi tapak 40 unit Aceh Tenggara.
* ⚖️ **Mode 3: APIP Inspektorat Jenderal / BPKP (Auditor Pengawas)**  
  * **Uji Kewajaran Harga**: Membandingkan otomatis harga satuan klaim dengan batas toleransi wajar pasar darurat KJPP.
  * **Auto Red-Flag**: Mendeteksi otomatis item belanja yang melampaui harga pasar (>10%).
  * **Penerbitan Surat "Audit Clearance"** berregistrasi resmi sebelum dana dicairkan.
* 👔 **Mode 4: PPK & Pimpinan (Eksekutif)**  
  Dashboard penyerapan anggaran, monitoring Kurva S biaya riil, kalkulator otomatis **Biaya Riil Sah + Imbalan/Fee 8%**, dan penerbitan **Berita Acara Verifikasi (BAV)**.

### 2. Instrumen Pengendalian Lahan (4 Tahap UU No. 6/2023 & PP 21/2021)
* **Tahap 1**: Lolos uji peta risiko bencana BPBD/BNPB (bebas zona KRB).
* **Tahap 2**: Validasi sertifikat induk *clean & clear* (bebas sengketa/waris/agunan bank).
* **Tahap 3**: Pengesahan *site plan* 40 kaveling & skema balik nama ke Pemda/Warga.
* **Tahap 4**: Penguncian risiko hukum ke dalam klausul kontrak.

### 3. Generator Berita Acara Verifikasi (BAV) Resmi Siap Cetak
Format standar kop surat resmi Kementerian PKP yang otomatis merekapitulasi seluruh pengeluaran sah, imbalan tetap (*fixed fee*), dan kolom tanda tangan digital 4 pihak (Pengembang, Tim Teknis, APIP, dan PPK). Siap dicetak langsung atau disimpan ke format PDF (`Ctrl + P`).

---

## 💻 Cara Menjalankan Aplikasi

Aplikasi ini bersifat **portabel, ringan, dan zero-dependency**. Anda bisa membukanya dengan 2 cara:

### Cara 1 (Paling Cepat / Langsung di Browser):
Cukup **klik ganda (double click)** file `index.html` pada File Explorer Anda. Aplikasi akan langsung terbuka di Google Chrome atau Microsoft Edge.

### Cara 2 (Menggunakan Server Lokal):
Buka terminal / PowerShell di folder ini, lalu jalankan:
```bash
python server.py
```
Aplikasi akan otomatis membuka browser di alamat: `http://localhost:8000`

---

## 📁 Struktur Berkas Proyek
* `index.html`: Antarmuka web modern dashboard verifikasi & form audit terintegrasi.
* `app.js`: Logika sistem, kalkulator kontrak darurat, filter data, auto red-flag, dan penyimpanan lokal (*LocalStorage*).
* `styles.css`: Desain visual, tipografi Kementerian PKP, dan format cetak *print-ready* Berita Acara.
* `server.py`: Server HTTP lokal Python sekali klik.
* `SKEMA PENGADAAN DARURAT HUNTAP ACEH 40 UNIT (1).pdf`: Dokumen sumber acuan konsep rancangan pengadaan.
