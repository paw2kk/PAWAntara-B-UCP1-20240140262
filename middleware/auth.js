// Middleware auth berbasis session.
// Dua versi karena konteksnya beda: halaman perlu redirect ke /login,
// sedangkan API harus balas 401 JSON (biar bisa dites langsung lewat Postman
// tanpa login dan tetap ditolak, terlepas dari apa yang disembunyikan di frontend).

function requireAuthPage(req, res, next) {
  if (!req.session || !req.session.isAdmin) {
    return res.redirect('/login');
  }
  next();
}

function requireAuthApi(req, res, next) {
  if (!req.session || !req.session.isAdmin) {
    return res.status(401).json({
      status: 'error',
      message: 'Belum login. Silakan login terlebih dahulu untuk mengakses resource ini.'
    });
  }
  next();
}

module.exports = { requireAuthPage, requireAuthApi };
