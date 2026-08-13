// Data produk dummy - akan diganti dengan SQLite/PostgreSQL di Sprint 2
const products = [
  {
    id: 1,
    name: 'Beras Pandan Wangi 5kg',
    category: 'sembako',
    price: 65000,
    stock: 20,
    icon: '🌾',
    description: 'Beras pulen kualitas premium, cocok untuk kebutuhan sehari-hari.'
  },
  {
    id: 2,
    name: 'Minyak Goreng 2L',
    category: 'sembako',
    price: 34000,
    stock: 15,
    icon: '🫙',
    description: 'Minyak goreng kemasan 2 liter, jernih dan berkualitas.'
  },
  {
    id: 3,
    name: 'Gula Pasir 1kg',
    category: 'sembako',
    price: 15000,
    stock: 30,
    icon: '🧂',
    description: 'Gula pasir putih bersih, kemasan 1 kilogram.'
  },
  {
    id: 4,
    name: 'Telur Ayam 1kg',
    category: 'sembako',
    price: 28000,
    stock: 25,
    icon: '🥚',
    description: 'Telur ayam segar pilihan, cocok untuk lauk maupun kue.'
  },
  {
    id: 5,
    name: 'Sabun Cuci Piring 800ml',
    category: 'rumah-tangga',
    price: 12000,
    stock: 18,
    icon: '🧼',
    description: 'Sabun cuci piring wangi jeruk, ampuh mengangkat lemak membandel.'
  },
  {
    id: 6,
    name: 'Deterjen Bubuk 1kg',
    category: 'rumah-tangga',
    price: 22000,
    stock: 12,
    icon: '🧺',
    description: 'Deterjen bubuk untuk cucian bersih dan wangi tahan lama.'
  }
];

module.exports = products;
