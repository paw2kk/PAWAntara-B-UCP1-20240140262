const express = require('express');
const router = express.Router();
const products = require('../data/products');
const { requireAuthPage } = require('../middleware/auth');

// GET / - Beranda
router.get('/', (req, res) => {
  const heroTiles = products.slice(0, 4);
  const preview = products.slice(0, 3);
  res.render('index', { title: 'Beranda', preview, heroTiles });
});

// GET /tanya-ai - Halaman chat Tanya AI (logic balasan diproses backend lewat POST /api/chat)
router.get('/tanya-ai', (req, res) => {
  res.render('tanya-ai', { title: 'Tanya AI' });
});

// GET /login - Halaman login admin/kasir
router.get('/login', (req, res) => {
  // Kalau sudah login, ngapain balik lagi ke halaman login
  if (req.session && req.session.isAdmin) {
    return res.redirect('/dashboard');
  }
  res.render('login', { title: 'Login Admin' });
});

// GET /dashboard - Halaman kelola produk, wajib login
router.get('/dashboard', requireAuthPage, (req, res) => {
  res.render('dashboard', { title: 'Dashboard Admin' });
});

module.exports = router;
