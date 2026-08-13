document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('product-grid');
  const emptyState = document.getElementById('product-empty');
  const countEl = document.getElementById('product-count');
  if (!grid) return;

  const params = new URLSearchParams(window.location.search);
  const kategori = (params.get('kategori') || '').toLowerCase();
  const search = (params.get('search') || '').toLowerCase();

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderCard(p) {
    const stokBadge = p.stock < 15
      ? `<span class="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Stok terbatas</span>`
      : '';

    return `
      <article class="group bg-white rounded-2xl border border-[#D9FFF4] p-5 hover:border-[#65DCD5] hover:shadow-lg transition-all">
        <div class="flex items-start justify-between">
          <div class="w-14 h-14 rounded-xl bg-[#D9FFF4] flex items-center justify-center text-2xl" aria-hidden="true">${p.icon || '📦'}</div>
          ${stokBadge}
        </div>
        <span class="inline-block text-[11px] uppercase tracking-wide bg-[#321E48]/5 text-[#43637E] px-2 py-0.5 rounded-full mt-3">${escapeHtml(p.category)}</span>
        <h2 class="font-semibold text-lg mt-2">${escapeHtml(p.name)}</h2>
        <div class="flex items-center justify-between mt-3">
          <span class="num font-semibold text-[#321E48]">Rp ${Number(p.price).toLocaleString('id-ID')}</span>
          <span class="text-xs text-[#43637E]">Stok ${p.stock}</span>
        </div>
        <a href="/produk/${p.id}" class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#43637E] group-hover:text-[#321E48]">
          Lihat Detail <span aria-hidden="true">&rarr;</span>
        </a>
      </article>
    `;
  }

  async function loadProducts() {
    try {
      const res = await fetch('/api/products');
      const result = await res.json();
      let products = result.data || [];

      if (kategori) {
        products = products.filter((p) => p.category.toLowerCase() === kategori);
      }
      if (search) {
        products = products.filter((p) => p.name.toLowerCase().includes(search));
      }

      if (products.length === 0) {
        grid.innerHTML = '';
        emptyState.classList.remove('hidden');
      } else {
        emptyState.classList.add('hidden');
        grid.innerHTML = products.map(renderCard).join('');
      }

      countEl.textContent = `Menampilkan ${products.length} produk${search ? ` untuk "${params.get('search')}"` : ''}`;
    } catch (err) {
      countEl.textContent = 'Gagal memuat data produk. Coba muat ulang halaman.';
    }
  }

  loadProducts();
});
