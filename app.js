const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static assets (css, js, images)
app.use(express.static(path.join(__dirname, 'public')));

// Body parsers (dipakai penuh mulai Sprint 2, tapi disiapkan dari awal)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Custom middleware: request logger
app.use((req, res, next) => {
  const waktu = new Date().toLocaleString('id-ID');
  console.log(`[${waktu}] ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
const indexRoutes = require('./routes/index');
const produkRoutes = require('./routes/produk');
const apiRoutes = require('./routes/api');

app.use('/', indexRoutes);
app.use('/produk', produkRoutes);
app.use('/api', apiRoutes);

// 404 handler (halaman tidak ditemukan)
app.use((req, res) => {
  res.status(404).render('404', { title: 'Halaman Tidak Ditemukan' });
});

app.listen(PORT, () => {
  console.log(`Server Toko Sembako Ariesta berjalan di http://localhost:${PORT}`);
});
