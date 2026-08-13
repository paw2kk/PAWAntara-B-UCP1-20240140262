// Middleware custom: mencatat method + endpoint + waktu setiap request yang masuk.
// Ini middleware wajib "di luar auth" sesuai ketentuan Sprint 2.

function requestLogger(req, res, next) {
  const waktu = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
  console.log(`[${waktu}] ${req.method} ${req.originalUrl}`);
  next();
}

module.exports = requestLogger;
