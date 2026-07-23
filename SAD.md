Menurut saya, daripada hanya membuat dokumen 10–15 halaman, kita sekalian membuat **Software Architecture Document (SAD)** yang benar-benar seperti dokumentasi profesional di perusahaan. Dokumen ini nanti bisa menjadi acuan implementasi proyek, dokumentasi untuk dosen, sekaligus pegangan jika suatu saat proyek dikembangkan lebih lanjut.

---

# SOFTWARE ARCHITECTURE DOCUMENT (SAD)

## Website Informasi Wisata Kota Madiun

Versi: 1.0

---

# BAB 1 Pendahuluan

## 1.1 Latar Belakang

Website Informasi Wisata Kota Madiun merupakan sebuah website yang bertujuan menyediakan informasi destinasi wisata secara lengkap kepada masyarakat maupun wisatawan. Website ini dirancang agar mudah diakses melalui berbagai perangkat, memiliki performa tinggi, serta mudah dikelola oleh administrator tanpa memerlukan kemampuan teknis di bidang pemrograman.

Selain sebagai media promosi pariwisata, website ini juga diharapkan menjadi pusat informasi yang dapat menampilkan berbagai destinasi wisata, sejarah, religi, kuliner, maupun wisata buatan yang terdapat di Kota Madiun.

---

## 1.2 Permasalahan

Berdasarkan hasil analisis kebutuhan, terdapat beberapa permasalahan utama:

* Administrator bukan berasal dari bidang IT.
* Administrator harus dapat mengubah konten secara mandiri.
* Website harus memiliki performa tinggi.
* Biaya hosting seminimal mungkin.
* Mudah dipelihara.
* Aman dari serangan umum seperti SQL Injection.
* Mendukung pengembangan jangka panjang.

---

## 1.3 Tujuan

Membangun website informasi wisata yang:

* Cepat
* Aman
* Responsif
* Mudah dikelola
* Mudah dikembangkan
* Gratis atau berbiaya sangat rendah
* Menggunakan arsitektur modern berbasis Static Website.

---

# BAB 2 Analisis Kebutuhan

## 2.1 Functional Requirements

Website harus memiliki fitur berikut:

### Pengunjung

* Melihat daftar wisata
* Melihat detail wisata
* Melihat galeri foto
* Melihat lokasi Google Maps
* Melakukan pencarian wisata
* Memfilter berdasarkan kategori
* Mengganti bahasa Indonesia / Inggris
* Mengakses halaman melalui QR Code

### Administrator

* Login CMS
* Menambah wisata
* Mengubah wisata
* Menghapus wisata
* Upload gambar
* Mengubah deskripsi bilingual
* Mengelola kategori

---

## 2.2 Non Functional Requirements

Website harus:

* Mobile Friendly
* SEO Friendly
* Fast Loading
* HTTPS
* Responsive
* Mudah di-maintain
* Memiliki CI/CD
* Static Website
* Mudah dikembangkan

---

# BAB 3 Arsitektur Sistem

## 3.1 Arsitektur yang Dipilih

Website menggunakan pendekatan **Static Site Architecture**.

```
Pengunjung

↓

Cloudflare CDN

↓

Cloudflare Pages

↓

HTML
CSS
JavaScript
Markdown/JSON
Images
```

Tidak ada backend yang berjalan ketika pengunjung membuka website.

Semua file dikirim langsung oleh Cloudflare CDN.

---

## 3.2 Arsitektur Admin

Administrator mengelola konten melalui Pages CMS.

```
Administrator

↓

Pages CMS

↓

GitHub App

↓

GitHub Repository (Private)

↓

GitHub Actions

↓

Cloudflare Pages

↓

Website
```

Administrator tidak berinteraksi langsung dengan GitHub.

---

# BAB 4 Pemilihan Teknologi

## Frontend

* HTML5
* CSS3
* JavaScript (Vanilla)

### Alasan

* Sangat ringan
* Mudah dipelajari
* Tidak membutuhkan framework
* Sangat cocok untuk website informasi

---

## Hosting

Cloudflare Pages

### Alasan

* Gratis
* CDN Global
* HTTPS otomatis
* Build otomatis
* Sangat cepat

---

## Repository

GitHub Private Repository

### Alasan

* Source code tetap aman
* Mendukung GitHub Actions
* Version Control
* Backup

---

## CI/CD

GitHub Actions

### Alasan

Deploy dilakukan otomatis setiap ada perubahan konten.

---

## CMS

Pages CMS

### Alasan

* Modern
* Berbasis Git
* Mudah digunakan
* Mendukung upload gambar
* Mendukung editor non programmer
* Mendukung collaborator berbasis email (sesuai kemampuan platform yang tersedia)

---

# BAB 5 Struktur Repository

```
website-wisata/

│

├── assets/

│ ├── images/

│ ├── icons/

│ └── logo/

│

├── content/

│ ├── wisata/

│ ├── kategori/

│ └── halaman/

│

├── css/

├── js/

├── index.html

├── kategori.html

├── detail.html

├── about.html

├── contact.html

│

├── .github/

│ └── workflows/

│

└── .pages.yml
```

---

# BAB 6 Struktur Konten

Seluruh data wisata disimpan dalam Markdown.

Contoh:

```
content/

wisata/

ngrowo.md
```

Isi:

```
title_id:

Ngrowo Bening

title_en:

Ngrowo Bening

category:

Wisata Alam

description_id:

...

description_en:

...

images:

- 1.webp

- 2.webp

- 3.webp

maps:

https://...

qr:

ngrowo.png
```

---

# BAB 7 Alur Kerja

## Menambah Wisata

Administrator

↓

Login CMS

↓

Isi Form

↓

Upload Foto

↓

Klik Save

↓

GitHub App membuat commit

↓

GitHub Actions berjalan

↓

Cloudflare Build

↓

Website otomatis diperbarui

---

# BAB 8 CI/CD

Pipeline:

```
Commit

↓

Validate Markdown

↓

Validate JSON

↓

Resize Image

↓

Convert WebP

↓

Generate Search Index

↓

Deploy Cloudflare Pages
```

---

# BAB 9 Keamanan

## Repository

* Private

## Website

* Public

## HTTPS

Menggunakan Cloudflare SSL.

## Security Header

* CSP
* X-Frame-Options
* X-Content-Type-Options
* Referrer Policy
* HSTS

## Backup

Repository GitHub menjadi backup utama seluruh website.

---

# BAB 10 Performa

Target:

Lighthouse

Performance ≥ 95

Accessibility ≥ 95

SEO ≥ 95

Best Practice ≥ 95

---

Optimasi

* Lazy Loading
* WebP
* Minify CSS
* Minify JS
* Cache Cloudflare
* Responsive Images

---

# BAB 11 Multi Bahasa

Website mendukung:

* Bahasa Indonesia
* English

Administrator dapat mengubah kedua bahasa melalui CMS.

---

# BAB 12 QR Code

Setiap wisata memiliki QR Code permanen.

Contoh:

```
https://jelajahmadiun.id/wisata/ngrowo-bening
```

QR Code hanya mengarah ke URL tersebut.

---

# BAB 13 Hak Akses

## Developer

* Mengubah source code
* Mengubah workflow
* Mengubah konfigurasi
* Mengelola repository
* Mengelola GitHub Actions

## Administrator

* CRUD wisata
* CRUD kategori
* Upload gambar
* Edit deskripsi
* Mengelola konten melalui CMS

Administrator tidak mengakses source code website.

---

# BAB 14 Pengembangan Masa Depan

Website dapat dikembangkan menjadi:

* Event Pariwisata
* Berita
* Kalender Event
* Hotel
* UMKM
* Oleh-oleh
* Paket Wisata
* Reservasi
* AI Chatbot Wisata
* PWA (Progressive Web App)
* Integrasi GIS
* Dashboard Statistik Pengunjung

---

# BAB 15 Kesimpulan

Arsitektur yang dipilih menggunakan **Static Website Architecture** dengan **Cloudflare Pages**, **GitHub Actions**, dan **Pages CMS** sebagai sistem manajemen konten. Pendekatan ini dipilih karena memberikan performa tinggi, keamanan yang baik, biaya operasional rendah, serta kemudahan bagi administrator non-teknis untuk mengelola konten.

---

# Lampiran A — Diagram Arsitektur

```text
                    INTERNET
                         │
         ┌───────────────┴───────────────┐
         │                               │
    Pengunjung                    Administrator
         │                               │
         │                         Pages CMS
         │                               │
         │                         GitHub App
         │                               │
         │                     GitHub Repository
         │                         (Private)
         │                               │
         │                       GitHub Actions
         │                               │
Cloudflare CDN  ◄──────── Cloudflare Pages
         │
HTML • CSS • JS • Markdown • Images
         │
     Website Public
```

---

## Satu catatan penting

Ada **satu keputusan yang saya sarankan belum ditulis sebagai keputusan final**, yaitu penggunaan **Pages CMS**. Alasannya, meskipun dokumentasi resminya mendukung model collaborator berbasis email, kita belum melakukan **proof of concept (PoC)** untuk memastikan alur yang kalian inginkan (editor tanpa akun GitHub, multi-editor, repository private, dan deploy ke Cloudflare Pages) benar-benar berjalan sesuai ekspektasi pada versi yang akan digunakan.

Karena itu, di dokumen resmi proyek saya akan menambahkan status:

> **Status:** *Pending Validation (PoC Required)*

Setelah PoC berhasil, barulah bagian tersebut diubah menjadi keputusan arsitektur final. Ini adalah praktik yang umum dalam dokumentasi arsitektur agar keputusan didasarkan pada hasil validasi, bukan hanya asumsi dari dokumentasi produk.
