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

  // Form Tanya AI - baru menampilkan pesan sendiri, logic balasan AI ada di Sprint 2
  const chatForm = document.getElementById('chat-form');
  const chatBox = document.getElementById('chat-box');

  if (chatForm && chatBox) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const input = document.getElementById('chat-input');
      const message = input.value.trim();
      if (!message) return;

      const emptyNotice = chatBox.querySelector('p.italic');
      if (emptyNotice) emptyNotice.remove();

      const bubble = document.createElement('p');
      bubble.className = 'text-sm mb-2';
      bubble.innerHTML = `<span class="font-semibold text-[#43637E]">Kamu:</span> ${message}`;
      chatBox.appendChild(bubble);

      input.value = '';
      chatBox.scrollTop = chatBox.scrollHeight;

      // TODO Sprint 2: kirim pertanyaan ke POST /api/chat dan tampilkan balasan AI dummy
    });
  }
});
