// Data akun admin/kasir.
// Password TIDAK disimpan plain text - yang disimpan cuma hash bcrypt-nya,
// dan hash itu sendiri diambil dari .env (bukan hardcode di file ini).
// Kalau butuh ganti password, lihat scripts/generate-hash.js

const admin = {
  username: process.env.ADMIN_USERNAME || 'admin',
  passwordHash: process.env.ADMIN_PASSWORD_HASH || ''
};

module.exports = admin;
