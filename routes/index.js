const express = require('express');
const router = express.Router();
const products = require('../data/products');

// GET / - Beranda
router.get('/', (req, res) => {
  const preview = products.slice(0, 3);
  res.render('index', { title: 'Beranda', preview });
});

// GET /tanya-ai - Halaman chat Tanya AI (logic balasan baru di Sprint 2)
router.get('/tanya-ai', (req, res) => {
  res.render('tanya-ai', { title: 'Tanya AI' });
});

module.exports = router;
