# Learnee

Learnee adalah platform belajar gratis untuk persiapan SNBT dan TKA SMA/SMK. Siswa dapat membaca ringkasan, mengerjakan latihan, dan melihat pembahasan. Situs ini juga menyediakan konsultasi mentor serta ruang admin untuk mengelola materi.

Materi dasar disimpan di aplikasi agar dapat dibaca setelah situs dibuka. Materi dan PDF yang disimpan di Supabase memerlukan koneksi internet, kecuali file tersebut sudah tersedia di perangkat.

## Menjalankan secara lokal

Pastikan Python sudah terpasang. Dari folder utama proyek, jalankan di PowerShell:

```powershell
python -m http.server 8000 --directory public
```

Buka <http://localhost:8000> di browser. Untuk menghentikan server, tekan `Ctrl+C` di PowerShell.

Gunakan server lokal atau HTTPS; membuka `index.html` langsung dengan `file://` tidak mengaktifkan Service Worker dan dapat mengganggu autentikasi.

## Konfigurasi layanan

Untuk login dan penyimpanan materi bersama, proyek memakai Firebase Authentication dan Supabase:

- Atur konfigurasi Firebase di `public/js/firebase-config.js`.
- Atur URL proyek dan publishable key Supabase di `public/js/supabase-config.js`.
- Jalankan `supabase/materials-security.sql` sekali pada proyek Supabase, lalu masukkan email Firebase admin ke tabel `material_admins`.

Jangan masukkan Supabase `service_role` key, Firebase Admin private key, atau kredensial server ke kode browser.

## Offline

Setelah situs dibuka saat online, Service Worker menyimpan halaman dan aset aplikasi untuk penggunaan dasar saat offline. Fitur yang perlu menghubungi Firebase atau Supabase tetap memerlukan internet.
