# PRD — Learnee (v2.1, Final Blueprint)

Platform Pembelajaran & Konsultasi SNBT/TKA untuk lomba *Web Development* bertema pendidikan.

## 1. Informasi Produk & Identitas Brand

- **Nama Produk:** Learnee (perpaduan *Learning* & *Free*)
- **Tagline:** "Belajar Bebas Batas, Tembus PTN Impian."
- **Target Pengguna:** Siswa Kelas 12 SMA/SMK/MA (pejuang SNBT & TKA), Guru/Mentor, dan Administrator
- **Maskot Resmi:** "Lee", robot/asisten pintar berbentuk bulat putih-biru dengan topi toga mini miring dan kacamata bulat kuning-biru, untuk *emotional design* dan panduan mode offline/online
- **Gaya Visual:** *Clean Modern EdTech*, ruang putih lega, sudut kartu membulat (16px / `rounded-2xl`), tipografi Plus Jakarta Sans atau Inter

| Token | Nilai |
|---|---|
| Primary Blue | `#2563EB` |
| Accent Yellow | `#FACC15` |
| Status Green | `#10B981` |
| Neutral Surface | `#FFFFFF` & `#F8FAFC` |

## 2. Peran Pengguna (Role Switcher tersedia agar juri mudah menguji semua peran)

1. **Guest / Siswa:** mengakses Beranda, Tentang Kami, materi SNBT & TKA (ringkasan, bank soal, video tutorial), mengklaim kuota konsultasi gratis/berbayar (Online/Offline), berinteraksi di ruang sesi chat, serta memberi rating & ulasan.
2. **Guru / Mentor:** mengunggah dokumen verifikasi (ijazah/transkrip/sertifikat), mengelola sesi konsultasi, mengunggah materi/soal, memantau Progress Bar Unlock Fee, dan mencairkan saldo pendapatan.
3. **Admin:** memvalidasi dokumen ijazah calon guru (Approve/Reject) dan memoderasi soal/materi sebelum tayang.

## 3. Arsitektur Informasi & Spesifikasi Halaman

### Navbar Sticky
- **Kiri:** logo Learnee (ikon topi toga + tipografi modern)
- **Tengah:** Beranda, Tentang Kami, Sesi SNBT, Sesi TKA, Fasilitas, Testimoni, FAQ
- **Kanan:** CTA "Mulai Konsultasi", Switch Role (Siswa / Guru / Admin), toggle simulasi "Mode Offline", indikator jaringan dinamis (● Status: Online hijau / ● Mode Offline kuning-abu)

### Bagian A — Beranda (Hero)
- Headline: "Belajar Bebas Batas, Tembus PTN Impian."
- Subheadline: "Akses materi SNBT & TKA—bahkan saat offline! Butuh bantuan? Konsultasi per sesi dengan mentor terverifikasi, mulai dari sesi gratis."
- Primary CTA "Mulai Konsultasi", secondary CTA "Gabung Jadi Mentor"
- Ilustrasi SVG Lee menyapa siswa dan 3 kartu sorotan: Sesi SNBT, Sesi TKA, Mentor Pilihan (badge kuning "Sesi Gratis Tersedia")

### Bagian B — Sesi SNBT & Sesi TKA (Core Learning & Consultation Hub)
Tab interaktif:
1. **Sesi SNBT:** TPS (PU, PPU, PBM, PK) dan Tes Literasi (Literasi B. Indonesia, Literasi B. Inggris, Penalaran Matematika)
2. **Sesi TKA:** Saintek (Matematika Lanjut, Fisika, Kimia, Biologi) dan Soshum (Ekonomi, Sosiologi, Geografi, Sejarah)

Konten setiap tab:
- **Ringkasan Materi:** halaman baca konsep inti, otomatis tersimpan di `localStorage` untuk akses offline
- **Bank Soal & Pembahasan:** latihan interaktif dengan kunci jawaban dan langkah penyelesaian
- **Video Tutorial:** kartu video pembahasan konsep & trik cepat (hanya saat online)
- **Direktori Mentor Mapel:** filter mapel & mode (Online/Offline); menampilkan foto, nama, spesialisasi, rating bintang (1–5), tarif per sesi, dan badge kuning "Sesi Gratis Tersedia" bila kuota gratis masih ada

### Bagian C — Mode Belajar & Fasilitas Unggulan
- **Konsultasi Online:** ruang chat sesi 45 menit + upload foto soal + tautan video call
- **Konsultasi Offline:** pilih domisili kota mentor dan titik temu ruang belajar
- 4 kartu fasilitas: Konsultasi Privat Per Sesi, Mentor Terverifikasi Ijazah, Sesi Gratis untuk Siswa, Akses Belajar Tanpa Internet

### Bagian D — Tentang Kami
- Visi pemerataan akses persiapan PTN di Indonesia
- Infografis 4 tahap kurasi mentor: Daftar & Upload Ijazah → Verifikasi Admin → 3x Sesi Gratis & Upload Materi → Klaim Fee

### Bagian E — Testimoni
- Kartu ulasan siswa kelas 12: nama, asal sekolah, target PTN/jurusan, rating sesi

### Bagian F — FAQ
- Accordion interaktif dengan 2 tab: **Kategori Siswa** (klaim kuota gratis, booking sesi, akses offline) dan **Kategori Guru/Mentor** (syarat dokumen, aturan 3 sesi gratis, pencairan fee)

### Bagian G — Footer
- Logo, deskripsi singkat, navigasi cepat, kontak bantuan, media sosial, keterangan proyek lomba *Web Development*

## 4. Logika Bisnis & Alur Interaktif

### 4.1 Alur Konsultasi Siswa (ala Halodoc)
1. Klik mentor → pilih mode Online atau Offline (isi lokasi pertemuan bila offline).
2. Bila mentor masih punya kuota sesi gratis, biaya otomatis **Rp 0 (Sesi Gratis)**.
3. Masuk **Ruang Konsultasi (simulasi chat)**: kirim teks dan unggah gambar/foto soal.
4. Klik "Akhiri Sesi" → modal wajib **Rating (1–5 bintang) & Ulasan**, otomatis memperbarui rating dan progres sesi gratis mentor.

### 4.2 Alur Pendaftaran & Monetisasi Guru (Teacher Verification & Fee Unlock Flow)
- Form registrasi guru + upload ijazah/transkrip/sertifikat.
- Dashboard Guru dengan **Progress Bar Unlock Fee**, 3 syarat wajib:
  1. Dokumen akademik terverifikasi Admin (`Pending` / `Verified`, disimulasikan lewat role Admin)
  2. Menyelesaikan **3 sesi konsultasi gratis** dengan rating minimal **4.0** (0/3 sampai 3/3)
  3. Mengunggah minimal **1 paket Ringkasan Materi / Bank Soal** (0/1 sampai 1/1)
- Sebelum 100%, tombol **Klaim / Tarik Fee** *disabled*.
- Setelah 100%: ilustrasi dan ucapan selamat dari Lee, badge berubah menjadi *Verified Mentor* berbayar, tombol Klaim Fee terbuka.

## 5. Implementasi Maskot "Lee" (SVG Kustom)

Robot belajar bulat putih-biru bertopi toga dan kacamata kuning-biru, dengan ekspresi kontekstual:

| Lokasi | Ekspresi |
|---|---|
| Hero Section | Menyapa siswa |
| Banner Mode Offline | Memakai headphone & membaca buku |
| Tab Sesi SNBT | Memegang kalkulator/rumus |
| Tab Sesi TKA | Memakai jas lab |
| Dashboard Guru | Memegang piala (unlock fee) |
| Floating Quick-Help Widget | Pojok kanan bawah |

## 6. Spesifikasi Teknis & Mode Offline (Offline-First Caching)

- Skema data: `users`, `teacher_profiles`, `materials`, `consultation_sessions`, `reviews`, dikelola dalam state & `localStorage` agar persisten.
- Deteksi event `online`/`offline` browser otomatis, plus tombol simulasi **Mode Offline** di navbar.
- Saat Mode Offline aktif:
  - Indikator navbar berubah menjadi "Mode Offline".
  - Muncul banner ramah dari Lee.
  - Beranda, Tentang Kami, Fasilitas, FAQ, serta Ringkasan Materi & Bank Soal yang tersimpan tetap dapat diakses penuh tanpa error.
  - Fitur real-time (kirim chat baru, putar video online, upload dokumen verifikasi, klaim fee) dinonaktifkan sementara dengan pesan informatif.
- Sertakan registrasi **Service Worker (`sw.js`)** agar halaman tahan *refresh* saat offline.

## 7. Output Teknis

Satu file HTML lengkap berbasis **Tailwind CSS (CDN)** dan **Vanilla JavaScript** (atau React single-file), siap dijalankan di browser dan dirender sebagai live preview dengan seluruh fitur interaktif berjalan.
