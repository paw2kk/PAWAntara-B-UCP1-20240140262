// Utilitas kecil untuk generate bcrypt hash dari password admin.
// Dipakai kalau mau ganti password admin tanpa menyimpan plain text di .env.
//
// Cara pakai:
//   node scripts/generate-hash.js "PasswordBaruYangKuat123!"
//
// Hasil hash-nya tinggal ditempel ke ADMIN_PASSWORD_HASH di file .env

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('Gunakan: node scripts/generate-hash.js "passwordkamu"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log('\nHash bcrypt untuk ADMIN_PASSWORD_HASH:\n');
console.log(hash);
console.log('\nTempel nilai di atas ke file .env sebagai ADMIN_PASSWORD_HASH\n');
