const express = require('express');
const router = express.Router();
const products = require('../data/products');

// GET /produk - halaman katalog produk.
// Data produk TIDAK lagi di-render langsung dari server (lihat public/js/produk.js) -
// halaman ini cuma render shell-nya, lalu JS di client yang fetch GET /api/products
// dan menerapkan filter kategori/pencarian dari query string.
router.get('/', (req, res) => {
  const { kategori, search } = req.query;
  res.render('produk', {
    title: 'Produk',
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
