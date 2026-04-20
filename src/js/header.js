document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.js-hamburger');
  const nav = document.querySelector('.js-nav');
  const overlay = document.querySelector('.js-overlay');

  if (hamburger && nav && overlay) {
    // Open/Close menu when clicking hamburger
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('js-nav--active');
      overlay.classList.toggle('js-overlay--active');
    });

    // Close menu when clicking overlay
    overlay.addEventListener('click', () => {
      nav.classList.remove('js-nav--active');
      overlay.classList.remove('js-overlay--active');
    });
  }
});
