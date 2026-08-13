document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('product-table-body');
  const form = document.getElementById('product-form');
  if (!tableBody || !form) return;

  const idInput = document.getElementById('product-id');
  const nameInput = document.getElementById('product-name');
  const categoryInput = document.getElementById('product-category');
  const iconInput = document.getElementById('product-icon');
  const priceInput = document.getElementById('product-price');
  const stockInput = document.getElementById('product-stock');
  const descriptionInput = document.getElementById('product-description');

  const formTitle = document.getElementById('form-title');
  const formError = document.getElementById('form-error');
  const formSuccess = document.getElementById('form-success');
  const submitBtn = document.getElementById('form-submit-btn');
  const cancelBtn = document.getElementById('form-cancel-btn');
  const logoutBtn = document.getElementById('dashboard-logout-btn');

  function showError(message) {
    formSuccess.classList.add('hidden');
    formError.textContent = message;
    formError.classList.remove('hidden');
  }

  function showSuccess(message) {
    formError.classList.add('hidden');
    formSuccess.textContent = message;
    formSuccess.classList.remove('hidden');
    setTimeout(() => formSuccess.classList.add('hidden'), 3000);
  }

  function resetForm() {
    form.reset();
    idInput.value = '';
    formTitle.textContent = 'Tambah Produk';
    submitBtn.textContent = 'Simpan Produk';
    cancelBtn.classList.add('hidden');
    formError.classList.add('hidden');
  }

  function formatRupiah(number) {
    return `Rp ${Number(number).toLocaleString('id-ID')}`;
  }

  function renderProducts(products) {
    if (!products.length) {
      tableBody.innerHTML = `
        <tr><td colspan="4" class="px-4 py-8 text-center text-[#43637E]">Belum ada produk. Tambahkan lewat form di samping.</td></tr>
      `;
      return;
    }

    tableBody.innerHTML = products.map((p) => `
      <tr class="border-t border-[#D9FFF4]">
        <td class="px-4 py-3">
          <div class="flex items-center gap-2">
            <span aria-hidden="true">${p.icon || '📦'}</span>
            <div>
              <p class="font-medium">${escapeHtml(p.name)}</p>
              <p class="text-xs text-[#43637E]">${escapeHtml(p.category)}</p>
            </div>
          </div>
        </td>
        <td class="px-4 py-3 num">${formatRupiah(p.price)}</td>
        <td class="px-4 py-3">${p.stock}</td>
        <td class="px-4 py-3 text-right whitespace-nowrap">
          <button type="button" data-action="edit" data-id="${p.id}" class="text-xs font-medium text-[#43637E] hover:text-[#321E48] mr-3">Edit</button>
          <button type="button" data-action="delete" data-id="${p.id}" class="text-xs font-medium text-red-600 hover:text-red-800">Hapus</button>
        </td>
      </tr>
    `).join('');
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  let currentProducts = [];

  async function loadProducts() {
    tableBody.innerHTML = `<tr><td colspan="4" class="px-4 py-8 text-center text-[#43637E]">Memuat data produk...</td></tr>`;
    try {
      const res = await fetch('/api/products');
      const result = await res.json();
      currentProducts = result.data || [];
      renderProducts(currentProducts);
    } catch (err) {
      tableBody.innerHTML = `<tr><td colspan="4" class="px-4 py-8 text-center text-red-600">Gagal memuat data produk.</td></tr>`;
    }
  }

  function fillFormForEdit(product) {
    idInput.value = product.id;
    nameInput.value = product.name;
    categoryInput.value = product.category;
    iconInput.value = product.icon || '';
    priceInput.value = product.price;
    stockInput.value = product.stock;
    descriptionInput.value = product.description || '';

    formTitle.textContent = 'Edit Produk';
    submitBtn.textContent = 'Update Produk';
    cancelBtn.classList.remove('hidden');
    formError.classList.add('hidden');
    nameInput.focus();
  }

  tableBody.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    const id = Number(btn.dataset.id);
    const action = btn.dataset.action;

    if (action === 'edit') {
      const product = currentProducts.find((p) => p.id === id);
      if (product) fillFormForEdit(product);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (action === 'delete') {
      const product = currentProducts.find((p) => p.id === id);
      const confirmDelete = confirm(`Hapus produk "${product ? product.name : id}"? Tindakan ini tidak bisa dibatalkan.`);
      if (!confirmDelete) return;

      try {
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        const result = await res.json();

        if (res.status === 401) {
          window.location.href = '/login';
          return;
        }

        if (result.status === 'success') {
          loadProducts();
        } else {
          alert(result.message || 'Gagal menghapus produk.');
        }
      } catch (err) {
        alert('Terjadi kesalahan jaringan saat menghapus produk.');
      }
    }
  });

  cancelBtn.addEventListener('click', resetForm);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validasi dasar di frontend sebelum request dikirim
    const name = nameInput.value.trim();
    const category = categoryInput.value;
    const price = priceInput.value;
    const stock = stockInput.value;

    if (!name || !category || price === '' || stock === '') {
      showError('Nama, kategori, harga, dan stok wajib diisi.');
      return;
    }
    if (Number(price) < 0 || Number(stock) < 0) {
      showError('Harga dan stok tidak boleh negatif.');
      return;
    }

    const payload = {
      name,
      category,
      icon: iconInput.value.trim(),
      price: Number(price),
      stock: Number(stock),
      description: descriptionInput.value.trim()
    };

    const editingId = idInput.value;
    const url = editingId ? `/api/products/${editingId}` : '/api/products';
    const method = editingId ? 'PUT' : 'POST';

    submitBtn.disabled = true;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }

      const result = await res.json();

      if (result.status === 'success') {
        showSuccess(editingId ? 'Produk berhasil diperbarui.' : 'Produk berhasil ditambahkan.');
        resetForm();
        loadProducts();
      } else {
        showError(result.message || 'Gagal menyimpan produk.');
      }
    } catch (err) {
      showError('Terjadi kesalahan jaringan saat menyimpan produk.');
    } finally {
      submitBtn.disabled = false;
    }
  });

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        const res = await fetch('/api/logout', { method: 'POST' });
        const result = await res.json();
        if (result.status === 'success') {
          window.location.href = '/login';
        }
      } catch (err) {
        alert('Gagal logout, coba lagi.');
      }
    });
  }

  loadProducts();
});
