require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');
const requestLogger = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static assets (css, js, images)
app.use(express.static(path.join(__dirname, 'public')));

// Body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session (dipakai untuk login admin/kasir)
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-jangan-dipakai-di-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 2 // 2 jam
  }
}));

// Custom middleware: request logger (di luar middleware auth)
app.use(requestLogger);

// Bikin status login kebaca di semua view (buat toggle menu Login/Dashboard/Logout di navbar)
app.use((req, res, next) => {
  res.locals.isLoggedIn = !!(req.session && req.session.isAdmin);
  res.locals.adminUsername = req.session ? req.session.username : null;
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
