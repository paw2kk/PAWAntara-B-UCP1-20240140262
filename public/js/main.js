document.addEventListener('DOMContentLoaded', () => {
  // Hamburger menu toggle (mobile navbar)
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('hidden');
      const isOpen = !navMenu.classList.contains('hidden');
      hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Tombol logout di navbar (muncul di semua halaman kalau lagi login)
  async function handleLogout() {
    try {
      const res = await fetch('/api/logout', { method: 'POST' });
      const result = await res.json();
      if (result.status === 'success') {
        window.location.href = '/';
      } else {
        alert(result.message || 'Gagal logout, coba lagi.');
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan saat logout.');
    }
  }

  const navbarLogoutBtn = document.getElementById('navbar-logout-btn');
  if (navbarLogoutBtn) {
    navbarLogoutBtn.addEventListener('click', handleLogout);
  }

  // ============================================================
  // Tanya AI - kirim pertanyaan ke POST /api/chat, tampilkan balasan asli dari server
  // ============================================================
  const chatForm = document.getElementById('chat-form');
  const chatBox = document.getElementById('chat-box');
  const chatInput = document.getElementById('chat-input');

  function addBubble(message, from) {
    const isUser = from === 'user';
    const wrap = document.createElement('div');
    wrap.className = `flex gap-2 ${isUser ? 'justify-end' : ''}`;

    const bubble = document.createElement('p');
    bubble.className = isUser
      ? 'bg-[#321E48] text-white rounded-2xl rounded-tr-sm px-4 py-2 text-sm max-w-[80%]'
      : 'bg-white border border-[#D9FFF4] rounded-2xl rounded-tl-sm px-4 py-2 text-sm max-w-[80%]';
    bubble.textContent = message;

    const avatar = document.createElement('span');
    avatar.className = isUser
      ? 'w-7 h-7 rounded-full bg-[#D9FFF4] text-[#321E48] flex items-center justify-center text-xs shrink-0'
      : 'w-7 h-7 rounded-full bg-[#321E48] text-[#65DCD5] flex items-center justify-center text-xs shrink-0';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = isUser ? 'Km' : '🤖';

    if (isUser) {
      wrap.appendChild(bubble);
      wrap.appendChild(avatar);
    } else {
      wrap.appendChild(avatar);
      wrap.appendChild(bubble);
    }

    chatBox.appendChild(wrap);
    chatBox.scrollTop = chatBox.scrollHeight;
    return wrap;
  }

  async function sendChatMessage(message) {
    addBubble(message, 'user');
    const typingEl = addBubble('Mengetik...', 'ai');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const result = await res.json();

      typingEl.remove();

      if (result.status === 'success') {
        addBubble(result.data.reply, 'ai');
      } else {
        addBubble(result.message || 'Maaf, terjadi kesalahan. Coba lagi ya.', 'ai');
      }
    } catch (err) {
      typingEl.remove();
      addBubble('Koneksi ke server bermasalah, coba lagi sebentar lagi ya.', 'ai');
    }
  }

  if (chatForm && chatBox && chatInput) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = chatInput.value.trim();
      if (!message) {
        chatInput.focus();
        return;
      }
      sendChatMessage(message);
      chatInput.value = '';
    });
  }

  // Suggestion chips fill the input for a quick send
  document.querySelectorAll('.chat-suggestion').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (chatInput) {
        chatInput.value = btn.textContent.trim();
        chatInput.focus();
      }
    });
  });
});
