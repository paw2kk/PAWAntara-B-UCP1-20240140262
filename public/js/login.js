document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const errorEl = document.getElementById('login-error');
  const submitBtn = document.getElementById('login-submit');

  function showError(message) {
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
  }

  function hideError() {
    errorEl.classList.add('hidden');
    errorEl.textContent = '';
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    // Validasi dasar di frontend - cegah submit kosong
    if (!username || !password) {
      showError('Username dan password wajib diisi.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Memproses...';

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const result = await res.json();

      if (result.status === 'success') {
        window.location.href = '/dashboard';
      } else {
        showError(result.message || 'Login gagal, coba lagi.');
      }
    } catch (err) {
      showError('Terjadi kesalahan jaringan. Coba lagi ya.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Masuk';
    }
  });
});
