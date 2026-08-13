const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const products = require('../data/products');
const admin = require('../data/admin');
const { requireAuthApi } = require('../middleware/auth');

// ============================================================
// AUTH
// ============================================================

// POST /api/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Username dan password wajib diisi'
    });
  }

  const usernameCocok = username === admin.username;
  const passwordCocok = admin.passwordHash
    ? bcrypt.compareSync(password, admin.passwordHash)
    : false;

  if (!usernameCocok || !passwordCocok) {
    return res.status(401).json({
      status: 'error',
      message: 'Username atau password salah'
    });
  }

  req.session.isAdmin = true;
  req.session.username = username;

  res.json({
    status: 'success',
    message: 'Login berhasil',
    data: { username }
  });
});

// POST /api/logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        message: 'Gagal logout, silakan coba lagi'
      });
    }
    res.clearCookie('connect.sid');
    res.json({ status: 'success', message: 'Logout berhasil' });
  });
});

// ============================================================
// PRODUCTS (CRUD)
// Semua endpoint di sini pakai array yang sama dengan yang dipakai
// routes/index.js dan routes/produk.js, jadi GET publik dan
// dashboard admin selalu baca dari satu sumber data yang sama.
// ============================================================

// GET /api/products - publik, boleh diakses tanpa login
router.get('/products', (req, res) => {
  res.json({
    status: 'success',
    message: 'Data produk berhasil diambil',
    data: products
  });
});

// GET /api/products/:id - publik
router.get('/products/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Produk tidak ditemukan'
    });
  }

  res.json({ status: 'success', message: 'Produk ditemukan', data: product });
});

function validateProductBody(body, { partial = false } = {}) {
  const errors = [];
  const { name, category, price, stock } = body;

  if (!partial || name !== undefined) {
    if (!name || typeof name !== 'string' || !name.trim()) {
      errors.push('Nama produk wajib diisi');
    }
  }
  if (!partial || category !== undefined) {
    if (!category || typeof category !== 'string' || !category.trim()) {
      errors.push('Kategori wajib diisi');
    }
  }
  if (!partial || price !== undefined) {
    if (price === undefined || price === null || isNaN(Number(price)) || Number(price) < 0) {
      errors.push('Harga harus berupa angka dan tidak boleh negatif');
    }
  }
  if (!partial || stock !== undefined) {
    if (stock === undefined || stock === null || isNaN(Number(stock)) || Number(stock) < 0) {
      errors.push('Stok harus berupa angka dan tidak boleh negatif');
    }
  }

  return errors;
}

// POST /api/products - wajib login
router.post('/products', requireAuthApi, (req, res) => {
  const errors = validateProductBody(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ status: 'error', message: errors.join(', ') });
  }

  const { name, category, price, stock, icon, description } = req.body;
  const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

  const newProduct = {
    id: newId,
    name: name.trim(),
    category: category.trim().toLowerCase(),
    price: Number(price),
    stock: Number(stock),
    icon: icon && icon.trim() ? icon.trim() : '📦',
    description: description ? description.trim() : ''
  };

  products.push(newProduct);

  res.status(201).json({
    status: 'success',
    message: 'Produk berhasil ditambahkan',
    data: newProduct
  });
});

// PUT /api/products/:id - wajib login
router.put('/products/:id', requireAuthApi, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ status: 'error', message: 'Produk tidak ditemukan' });
  }

  const errors = validateProductBody(req.body, { partial: true });
  if (errors.length > 0) {
    return res.status(400).json({ status: 'error', message: errors.join(', ') });
  }

  const { name, category, price, stock, icon, description } = req.body;

  if (name !== undefined) product.name = name.trim();
  if (category !== undefined) product.category = category.trim().toLowerCase();
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);
  if (icon !== undefined) product.icon = icon.trim() || '📦';
  if (description !== undefined) product.description = description.trim();

  res.json({
    status: 'success',
    message: 'Produk berhasil diperbarui',
    data: product
  });
});

// DELETE /api/products/:id - wajib login
router.delete('/products/:id', requireAuthApi, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ status: 'error', message: 'Produk tidak ditemukan' });
  }

  const deleted = products.splice(index, 1)[0];

  res.json({
    status: 'success',
    message: 'Produk berhasil dihapus',
    data: deleted
  });
});

// ============================================================
// CHAT (Tanya AI dummy)
// Balasan 100% logic sendiri (keyword matching), bukan API AI eksternal.
// ============================================================

function buildChatReply(pesanAsli) {
  const pesan = pesanAsli.toLowerCase();

  if (/(jam\s?buka|jam\s?operasional|buka jam berapa|tutup jam berapa)/.test(pesan)) {
    return 'Toko kami buka setiap hari jam 07.00 - 20.00 WIB, termasuk weekend ya!';
  }

  if (/(ongkir|antar|delivery|kirim ke rumah|diantar)/.test(pesan)) {
    return 'Bisa diantar untuk area sekitar toko dengan ongkir mulai Rp5.000, tergantung jarak. Kalau ambil sendiri di toko, gratis ya.';
  }

  if (/(bayar|pembayaran|transfer|qris|cod|cash)/.test(pesan)) {
    return 'Pembayaran bisa cash langsung di toko, transfer bank, atau QRIS. Semua metode aman dan langsung dikonfirmasi kasir.';
  }

  const namaProdukDitemukan = products.find((p) =>
    pesan.includes(p.name.toLowerCase().split(' ')[0])
  );

  if (/(stok|ada gak|masih ada|tersedia|kosong)/.test(pesan)) {
    if (namaProdukDitemukan) {
      return namaProdukDitemukan.stock > 0
        ? `${namaProdukDitemukan.name} masih tersedia, stok saat ini ${namaProdukDitemukan.stock} unit dengan harga Rp${namaProdukDitemukan.price.toLocaleString('id-ID')}.`
        : `Waduh, ${namaProdukDitemukan.name} lagi kosong nih. Coba tanya lagi beberapa hari ke depan ya.`;
    }
    return 'Boleh sebutkan nama produknya lebih spesifik? Biar kucekin stoknya langsung.';
  }

  if (namaProdukDitemukan) {
    return `${namaProdukDitemukan.name} tersedia dengan harga Rp${namaProdukDitemukan.price.toLocaleString('id-ID')} dan stok ${namaProdukDitemukan.stock} unit.`;
  }

  const balasanUmum = [
    'Terima kasih sudah bertanya! Untuk info lebih detail soal produk, harga, atau stok, boleh sebutkan nama barangnya.',
    'Kasir virtual kami siap bantu soal jam buka, ongkir, cara bayar, atau ketersediaan stok. Coba tanya salah satunya ya!',
    'Hmm, coba tanyakan dengan kata kunci seperti "jam buka", "ongkir", "cara bayar", atau nama produk tertentu ya.'
  ];

  return balasanUmum[Math.floor(Math.random() * balasanUmum.length)];
}

// POST /api/chat
router.post('/chat', (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({
      status: 'error',
      message: 'Pesan tidak boleh kosong'
    });
  }

  const reply = buildChatReply(message.trim());

  res.json({
    status: 'success',
    message: 'Balasan berhasil dibuat',
    data: { reply }
  });
});

module.exports = router;
