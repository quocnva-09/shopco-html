export function initAuth() {
  const authContainer = document.querySelector('.js-auth-container');
  if (!authContainer) return;

  const authTabs = document.querySelectorAll('.js-auth-tab');
  const authForm = document.querySelector('.auth__form');

  authTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetMode = tab.dataset.target;
      if (!targetMode) return;

      // Update container state
      authContainer.dataset.mode = targetMode;

      // Update active tab styling
      document.querySelectorAll('.auth__tab').forEach(t => {
        t.classList.remove('auth__tab--active');
      });
      // The tab clicked might be the link in description, so we update the actual tabs
      document.querySelectorAll(`.auth__tab[data-target="${targetMode}"]`).forEach(t => {
        t.classList.add('auth__tab--active');
      });

      // Reset form on mode switch
      if (authForm) {
        authForm.reset();
        
        // Update required attributes based on mode
        const nameInput = document.getElementById('name');
        const confirmPasswordInput = document.getElementById('confirm-password');
        
        if (targetMode === 'register') {
          if (nameInput) nameInput.setAttribute('required', 'required');
          if (confirmPasswordInput) confirmPasswordInput.setAttribute('required', 'required');
        } else {
          if (nameInput) nameInput.removeAttribute('required');
          if (confirmPasswordInput) confirmPasswordInput.removeAttribute('required');
        }
      }
    });
  });
}
