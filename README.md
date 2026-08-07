# Toko Sembako Ariesta

**Nama:** Aufa Maha Dana
**NIM:** 20240140262
**Kelas:** B
**Mata Kuliah:** Pemrograman Aplikasi Web (PAW) — UCP 1

## Deskripsi Project

Website toko sembako sederhana untuk **Toko Sembako Ariesta**, dibangun dengan Node.js + Express.js dan view engine EJS. Pelanggan bisa melihat daftar produk, mencari/memfilter produk, melihat detail produk, dan (mulai Sprint 2) bertanya lewat fitur Tanya AI dummy. Admin/kasir toko akan bisa login untuk mengelola data produk lewat REST API penuh di Sprint 2.

Sprint 1 ini berfokus pada fondasi: struktur halaman semantik dengan EJS + partials, styling responsif (Tailwind CDN), server Express dasar, routing dinamis, dan satu endpoint REST API read-only.

## Cara Menjalankan Project Secara Lokal

```bash
npm install
npm run dev
```

Server berjalan di `http://localhost:3000`. Gunakan `npm start` untuk menjalankan tanpa nodemon (tanpa auto-restart).

## Struktur Folder

```
toko-sembako-ariesta/
├── app.js
├── data/
│   └── products.js        # data produk dummy
├── routes/
│   ├── index.js            # beranda & tanya-ai
│   ├── produk.js            # daftar & detail produk
│   └── api.js               # REST API
├── views/
│   ├── partials/            # navbar, footer, head
│   ├── index.ejs
│   ├── produk.ejs
│   ├── detail.ejs
│   ├── tanya-ai.ejs
│   └── 404.ejs
└── public/
    ├── css/style.css
    └── js/main.js
```

## Daftar Endpoint API

| Method | Endpoint         | Deskripsi                                   | Akses  |
|--------|------------------|----------------------------------------------|--------|
| GET    | `/api/products`  | Ambil seluruh data produk sembako (JSON)      | Publik |

> Endpoint CRUD penuh (POST/PUT/DELETE), login admin, dan `/api/chat` akan ditambahkan di Sprint 2.

## Halaman

| Route              | Deskripsi                                                        |
|---------------------|-------------------------------------------------------------------|
| `GET /`             | Beranda — hero section + preview 3 produk                        |
| `GET /produk`       | Daftar semua produk dalam bentuk card, mendukung filter `?kategori=` dan `?search=` |
| `GET /produk/:id`   | Detail satu produk berdasarkan ID; menampilkan pesan wajar jika ID tidak ditemukan |
| `GET /tanya-ai`     | Halaman chat Tanya AI (tampilan saja, logic balasan menyusul di Sprint 2) |

## Penjelasan Tampilan (UI)

- - **Tema warna:** navy ungu `#321E48` (navbar, footer, heading), slate blue `#43637E` (button hover, harga, link), mint `#65DCD5` (aksen hover card), dan mint pucat `#D9FFF4` (background hero, badge kategori).
- **Navbar:** sticky di atas, berisi logo toko dan 3 menu (Beranda, Produk, Tanya AI). Di layar mobile, menu disembunyikan di balik tombol hamburger (☰) yang dibuka/ditutup dengan vanilla JS.
- **Beranda:** hero section berisi headline + CTA ke halaman Produk, diikuti grid preview 3 produk unggulan.
- **Produk:** form pencarian (nama) dan filter kategori di atas, grid card produk responsif (1 kolom di mobile, 2–3 kolom di layar lebih besar).
- **Detail Produk:** tampilan artikel dengan nama, kategori, harga, stok, dan deskripsi produk; menampilkan pesan "Produk Tidak Ditemukan" yang rapi jika ID tidak valid.
- **Tanya AI:** area chat sederhana dan form input pertanyaan; saat ini pesan dari pengguna langsung tampil di kotak chat, balasan otomatis dari backend menyusul di Sprint 2.
- **Responsif:** menggunakan Tailwind CDN (utility classes + grid/flex) ditambah custom media query di `public/css/style.css` untuk breakpoint mobile (`max-width: 640px`) dan desktop (`min-width: 768px`).
