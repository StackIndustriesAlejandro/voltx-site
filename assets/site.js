// ============================================================
// VOLT-X — Shared site script
// Mobile menu, header scroll state, and form submission via Web3Forms.
// Language is handled via separate EN/ES URLs (see hreflang in <head>),
// not client-side toggling.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Mobile menu ----------
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const drawer = document.querySelector('.mobile-drawer');
  const drawerClose = document.querySelector('.mobile-drawer-close');
  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', () => drawer.classList.add('open'));
  }
  if (drawerClose && drawer) {
    drawerClose.addEventListener('click', () => drawer.classList.remove('open'));
  }

  // ---------- Header scroll state ----------
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 10 ? '0 4px 24px rgba(0,0,0,0.25)' : 'none';
    });
  }

  // ---------- Form handling (real submission via Web3Forms) ----------
  document.querySelectorAll('form[data-voltx-form]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Honeypot: if a bot filled this hidden field, silently drop the submission.
      const honeypot = form.querySelector('input[name="botcheck"]');
      if (honeypot && honeypot.checked) return;

      const wrap = form.closest('.form-wrap');
      const success = wrap ? wrap.querySelector('.form-success') : null;
      const submitBtn = form.querySelector('button[type="submit"]');
      const currentLang = document.documentElement.getAttribute('lang') || 'en';

      // Basic loading state on the button while the request is in flight.
      let originalBtnHTML = null;
      if (submitBtn) {
        originalBtnHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.textContent = currentLang === 'es' ? 'Enviando…' : 'Sending…';
      }

      try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        });
        const result = await response.json();

        if (response.ok && result.success) {
          if (form && success) {
            form.style.display = 'none';
            success.classList.add('show');
          }
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (err) {
        console.error('VOLT-X form submission error:', err);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        }
        alert(currentLang === 'es'
          ? 'No se pudo enviar el formulario. Por favor intenta de nuevo o escríbenos a sales@grp-x.com.'
          : 'We could not submit the form. Please try again or email us directly at sales@grp-x.com.');
      }
    });
  });

});
