# JelajahMadiun - Portal Resmi Informasi Wisata Kota Madiun

![JelajahMadiun Banner](https://jelajahmadiun.pages.dev/assets/images/hero/hero-madiun.webp)

**JelajahMadiun** adalah portal resmi informasi pariwisata, kebudayaan, cagar budaya, dan kelezatan kuliner Kota Madiun. Dikembangkan menggunakan arsitektur web statis berkinerja tinggi, aman, SEO-friendly, dan dikelola secara instan melalui **Pages CMS** dan **Cloudflare Pages**.

---

## 🚀 Fitur Utama & Keunggulan

- **Arsitektur Tanpa Server (Serverless Static)**: Cepat, aman, bebas risiko kerentanan database backend.
- **Pages CMS Direct Deployment**: Pengelolaan konten Markdown & YAML Front Matter langsung tersinkronisasi dengan repositori GitHub dan Cloudflare Pages tanpa memerlukan server build eksternal.
- **Model Data Wisata Komplit (34 Destinasi)**:
  - **Wisata Buatan** (Pahlawan Street Center, Pahlawan Religi Centre, Taman Lalu Lintas Bantaran, Taman Hijau Demangan, Ngrowo Bening Edupark, dll.)
  - **Wisata Sejarah** (Bosbow ex-OSVIA, Sendang Gayam, Makam Kuno Taman, Monumen TGP, Walk Heritage Pangongangan, Gedung Bakorwil II)
  - **Wisata Religi** (Masjid Besar Kuno Taman, Masjid Kuno Kuncen, Makam Ki Ageng Ronggo Jumeno, Gereja Santo Cornelius, Klenteng Hwie Ing Kiong)
  - **Wisata Kuliner** (Nasi Pecel 99, Ayam Goreng Pak To, Nasi Pecel Pojok, Yu Gembrot, Dawet Suronatan, Bluder Cokro, Brem Toko Mirasa)
- **Desain Kelas Pemerintah (Government Quality)**: Palet warna khas pariwisata Madiun (*Deep Teal `#0F766E`*, *Emerald `#14B8A6`*, *Amber Gold `#F59E0B`*), tipografi Google Font *Plus Jakarta Sans*, dan *Lucide Icons*.
- **Pencarian Real-Time & Filter**: Live client-side search dan filter kategori instan.
- **Keamanan & SEO Maksimal**: Header keamanan Cloudflare (`CSP`, `X-Frame-Options`, `Referrer-Policy`), Schema.org JSON-LD structured data, `sitemap.xml`, dan `robots.txt` ramah Google Sitelinks.
- **Aksesibilitas Tinggi (WCAG 2.2)**: Panduan kontras tinggi, navigasi keyboard terstruktur, indikator fokus jelas, dan ramah pembaca layar.

---

## 📂 Struktur Proyek

```text
JelajahMadiun/
├── assets/                  # Media visual & aset statis
│   ├── images/              # Foto destinasi (hero, kategori, wisata, default)
│   ├── icons/               # Icon SVG
│   ├── logo/                # Logo resmi
│   └── fonts/               # Font lokal
├── content/                 # Data konten Markdown + YAML Front Matter
│   ├── wisata/              # 34 file markdown destinasi per kategori
│   │   ├── wisata-buatan/
│   │   ├── wisata-sejarah/
│   │   ├── wisata-religi/
│   │   └── kuliner/
│   ├── kategori/            # Model kategori wisata
│   ├── halaman/             # Halaman statis (about, privacy, terms)
│   └── settings/            # website.yml (konfigurasi global)
├── public/                  # Berkas hosting Cloudflare Pages
│   ├── _headers             # Cloudflare Security & Cache-Control headers
│   ├── robots.txt           # Panduan crawler mesin pencari
│   └── sitemap.xml          # Peta situs XML untuk Google Sitelinks
├── src/                     # Source code frontend
│   ├── css/                 # Arsitektur CSS Modular
│   │   ├── variables.css
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   ├── utilities.css
│   │   └── responsive.css
│   ├── js/                  # JavaScript Modular ES6
│   │   ├── utils/           # Parser Markdown, SEO, Component Loader
│   │   ├── services/        # Content Fetcher & Live Search Service
│   │   ├── components/      # Controller Navbar, Search, Language Switch
│   │   └── main.js          # App Bootstrap
│   ├── components/          # Template HTML Komponen Modular
│   └── pages/               # Halaman HTML (kategori, wisata, detail, about, contact)
├── .pages.yml               # Konfigurasi Administrasi Pages CMS
├── index.html               # Halaman Beranda Utama
└── README.md                # Dokumentasi Proyek
```

---

## 🛠️ Pengembangan Lokal (Development)

Untuk menjalankan proyek secara lokal, Anda dapat menggunakan HTTP dev server sederhana:

```bash
# Jalankan menggunakan Live Server atau HTTP server lokal pilihan Anda
npx serve .
```

Buka `http://localhost:3000` di peramban Anda.

### 🧪 Validasi Konten
Untuk menguji validitas format data Markdown & YAML Front Matter:

```bash
node scripts/validation/validate-content.js
```

---

## ⚡ Alur Publikasi & Content Management System (CMS)

Sistem ini dikelola tanpa perlu melakukan build script manual:

1. **Pages CMS** (`https://pagescms.org`): Administrator mengedit atau menambah destinasi melalui antarmuka web.
2. **GitHub Automatic Commit**: Perubahan disimpan langsung ke repositori GitHub cabang `main`.
3. **Cloudflare Pages Auto Deploy**: Cloudflare Pages mendeteksi commit baru dan secara otomatis mempublikasikan versi terbaru dalam hitungan detik.

---

## 📄 Lisensi & Hak Cipta

© 2026 Pemerintah Kota Madiun & Tim Pengembang JelajahMadiun. Seluruh hak cipta dilindungi undang-undang.