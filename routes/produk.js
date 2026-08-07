const express = require('express');
const router = express.Router();
const products = require('../data/products');

// GET /produk - daftar produk + filter kategori/search lewat query string
router.get('/', (req, res) => {
  const { kategori, search } = req.query;
  let filtered = products;

  if (kategori) {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === kategori.toLowerCase()
    );
  }

  if (search) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.render('produk', {
    title: 'Produk',
    products: filtered,
    kategori: kategori || '',
    search: search || ''
  });
});

// GET /produk/:id - detail produk, route dinamis
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res
      .status(404)
      .render('detail', { title: 'Produk Tidak Ditemukan', product: null });
  }

  res.render('detail', { title: product.name, product });
});

module.exports = router;
