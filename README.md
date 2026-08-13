# Toko Sembako Ariesta

**Nama:** Aufa Maha Dana
**NIM:** 20240140262
**Kelas:** B
**Mata Kuliah:** Pemrograman Aplikasi Web (PAW) — UCP 1

## Deskripsi Project

Website toko sembako untuk **Toko Sembako Ariesta**, dibangun dengan Node.js + Express.js dan view engine EJS. Pelanggan bisa melihat daftar produk (diambil dinamis lewat REST API), mencari/memfilter produk, melihat detail produk, dan bertanya lewat fitur Tanya AI (balasan dummy 100% buatan sendiri di backend). Admin/kasir toko login untuk mengelola data produk — tambah, edit, hapus, termasuk update stok & harga — lewat dashboard yang terhubung ke REST API penuh.

- **Sprint 1** membangun fondasi: struktur halaman EJS + partials, styling responsif (Tailwind CDN), server Express dasar, routing dinamis, dan satu endpoint REST API read-only.
- **Sprint 2** (sprint ini) menghidupkan websitenya: login admin berbasis session, middleware auth yang melindungi dashboard & endpoint mutasi produk, REST API CRUD produk penuh, dashboard admin, halaman Produk publik yang fetch data secara dinamis, dan fitur Tanya AI yang benar-benar terhubung ke backend.

## Cara Menjalankan Project Secara Lokal

```bash
npm install
cp .env.example .env
```

Isi `.env` dengan kredensial kamu sendiri (lihat bagian "Konfigurasi .env" di bawah), lalu:

```bash
npm run dev
```

Server berjalan di `http://localhost:3000`. Gunakan `npm start` untuk menjalankan tanpa nodemon (tanpa auto-restart).

### Konfigurasi `.env`

File `.env` **tidak ikut di-commit** (lihat `.gitignore`) supaya kredensial tidak bocor ke repo publik. Salin dari `.env.example` lalu isi:

| Key                    | Keterangan                                                        |
|-------------------------|--------------------------------------------------------------------|
| `PORT`                  | Port server, default `3000`                                       |
| `SESSION_SECRET`        | String rahasia untuk enkripsi session, isi bebas yang panjang      |
| `ADMIN_USERNAME`        | Username admin/kasir untuk login dashboard                        |
| `ADMIN_PASSWORD_HASH`   | Hash bcrypt dari password admin (bukan plain text)                |

Password admin **tidak disimpan plain text**. Generate hash bcrypt-nya lewat:

```bash
node scripts/generate-hash.js "passwordkamu"
```

lalu tempel hasilnya ke `ADMIN_PASSWORD_HASH` di `.env`.

### Kredensial Akun Admin (untuk keperluan pengecekan asisten)

| Username | Password       |
|----------|----------------|
| `admin`  | `Ariesta#2025` |

## Struktur Folder

```
toko-sembako-ariesta/
├── app.js
├── data/
│   ├── products.js         # data produk (in-memory array, single source of truth)
│   └── admin.js             # kredensial admin, dibaca dari .env
├── middleware/
│   ├── auth.js               # requireAuthPage (redirect) & requireAuthApi (401 JSON)
│   └── logger.js             # custom middleware: log method + endpoint + waktu
├── routes/
│   ├── index.js               # beranda, tanya-ai, login, dashboard
│   ├── produk.js               # halaman katalog & detail produk
│   └── api.js                   # REST API: auth, CRUD produk, chat
├── scripts/
│   └── generate-hash.js         # utilitas bikin hash bcrypt untuk password admin
├── views/
│   ├── partials/                 # navbar, footer, head
│   ├── index.ejs
│   ├── produk.ejs                 # shell halaman, data di-fetch dinamis lewat JS
│   ├── detail.ejs
│   ├── tanya-ai.ejs
│   ├── login.ejs
│   ├── dashboard.ejs
│   └── 404.ejs
└── public/
    ├── css/style.css
    └── js/
        ├── main.js                # hamburger menu, logout navbar, chat Tanya AI
        ├── login.js                # validasi + fetch POST /api/login
        ├── dashboard.js             # CRUD produk lewat Fetch API
        └── produk.js                 # fetch GET /api/products + filter dinamis
```

## Daftar Endpoint API

| Method | Endpoint              | Deskripsi                                              | Akses         |
|--------|------------------------|----------------------------------------------------------|----------------|
| POST   | `/api/login`            | Login admin/kasir, membuat session                        | Publik         |
| POST   | `/api/logout`            | Logout, menghapus session                                  | Publik*        |
| GET    | `/api/products`          | Ambil seluruh data produk                                   | Publik         |
| GET    | `/api/products/:id`       | Ambil satu produk berdasarkan ID                              | Publik         |
| POST   | `/api/products`            | Tambah produk baru                                             | **Wajib login** |
| PUT    | `/api/products/:id`         | Update produk (harga, stok, dll)                                 | **Wajib login** |
| DELETE | `/api/products/:id`          | Hapus produk                                                        | **Wajib login** |
| POST   | `/api/chat`                   | Kirim pertanyaan, dapat balasan dummy (keyword matching)               | Publik         |

*\* boleh dipanggil tanpa login, tapi kalau memang belum ada session yang aktif ya tidak ada efeknya.*

Endpoint mutasi produk (`POST`/`PUT`/`DELETE`) dicek statusnya **di server** lewat middleware `requireAuthApi` — kalau di-hit langsung lewat Postman tanpa login, tetap ditolak dengan `401`.

### Contoh Response

```json
// GET /api/products
{
  "status": "success",
  "message": "Data produk berhasil diambil",
  "data": [ { "id": 1, "name": "Beras Pandan Wangi 5kg", "category": "sembako", "price": 65000, "stock": 20, "icon": "🌾", "description": "..." } ]
}

// POST /api/products tanpa login
{
  "status": "error",
  "message": "Belum login. Silakan login terlebih dahulu untuk mengakses resource ini."
}
```

## Halaman

| Route              | Deskripsi                                                                 | Akses         |
|---------------------|------------------------------------------------------------------------------|----------------|
| `GET /`             | Beranda — hero section + preview 3 produk                                     | Publik         |
| `GET /produk`       | Katalog produk, data diambil dinamis lewat `GET /api/products`, mendukung `?kategori=` & `?search=` | Publik         |
| `GET /produk/:id`   | Detail satu produk berdasarkan ID                                                  | Publik         |
| `GET /tanya-ai`     | Chat Tanya AI, terhubung ke `POST /api/chat`                                          | Publik         |
| `GET /login`        | Form login admin/kasir                                                                  | Publik         |
| `GET /dashboard`    | Kelola produk (tambah/edit/hapus)                                                          | **Wajib login** |

## Fitur Sprint 2

- **Login admin/kasir** — session-based (`express-session`), password di-hash pakai `bcryptjs`, tidak ada plain text password yang dibandingkan langsung.
- **Middleware auth** — dua versi: `requireAuthPage` (redirect ke `/login` untuk halaman) dan `requireAuthApi` (response `401` JSON untuk API), keduanya cek session di server, bukan cuma disembunyikan di frontend.
- **Middleware custom lain** — `requestLogger` di `middleware/logger.js`, mencatat method + endpoint + waktu setiap request yang masuk (kelihatan di log terminal).
- **REST API CRUD produk penuh** — `GET`/`POST`/`PUT`/`DELETE`, semua baca-tulis dari satu sumber data yang sama (`data/products.js`), jadi perubahan di dashboard langsung kelihatan di halaman Produk publik tanpa restart server.
- **Dashboard admin** — form tambah/edit produk + tabel list, semua komunikasi lewat Fetch API (`async`/`await`), tidak ada reload halaman untuk operasi CRUD.
- **Halaman Produk dinamis** — tidak ada lagi data hardcode di server render, semua diambil lewat `fetch('/api/products')` di `public/js/produk.js`.
- **Tanya AI** — `POST /api/chat` memproses balasan lewat keyword matching (jam buka, ongkir/antar, cara pembayaran, ketersediaan stok per nama produk), 100% logic sendiri, bukan API AI eksternal.
- **Validasi input dasar di frontend** — form login, form produk di dashboard, dan form Tanya AI semuanya cek input kosong sebelum request dikirim.

## Penjelasan Tampilan (UI)

- **Tema warna:** navy ungu `#321E48` (navbar, footer, heading), slate blue `#43637E` (button hover, harga, link), mint `#65DCD5` (aksen hover card), dan mint pucat `#D9FFF4` (background hero, badge kategori).
- **Navbar:** sticky di atas, berisi logo toko dan menu Beranda/Produk/Tanya AI. Kalau sudah login, muncul menu Dashboard + tombol Logout menggantikan tombol Login Admin. Di layar mobile, menu disembunyikan di balik tombol hamburger (☰).
- **Beranda:** hero section berisi headline + CTA ke halaman Produk, diikuti grid preview 3 produk unggulan.
- **Produk:** form pencarian (nama) dan filter kategori di atas, grid card produk responsif yang di-render dari data API.
- **Login:** form sederhana di tengah layar dengan validasi dan pesan error yang jelas kalau kredensial salah.
- **Dashboard:** layout dua kolom — form tambah/edit produk di kiri, tabel produk (dengan tombol Edit/Hapus) di kanan.
- **Tanya AI:** area chat dengan bubble pelanggan & AI yang tampil dinamis, plus beberapa tombol saran pertanyaan cepat.
- **Responsif:** Tailwind CDN (utility classes + grid/flex) ditambah custom media query di `public/css/style.css`.
