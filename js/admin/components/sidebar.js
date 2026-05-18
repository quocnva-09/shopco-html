/**
 * Initializes the admin sidebar component and injects it into the DOM.
 * 
 * @param {HTMLElement} container - The DOM element where the sidebar should be rendered.
 */
export function initSidebar(container) {
  if (!container) return;

  const sidebarHTML = `
    <aside class="admin-sidebar js-admin-sidebar-el">
      <div class="admin-sidebar__logo">
        SHOP.CO
        <button class="admin-sidebar__close-btn js-sidebar-close" aria-label="Close sidebar">
          <i data-lucide="x"></i>
        </button>
      </div>
      <nav class="admin-sidebar__nav">
        <ul class="admin-sidebar__list">
          <li class="admin-sidebar__item">
            <a href="#" class="admin-sidebar__link admin-sidebar__link--active">
              <i data-lucide="layout-dashboard"></i> Overview
            </a>
          </li>
          <li class="admin-sidebar__item">
            <a href="#" class="admin-sidebar__link">
              <i data-lucide="shopping-cart"></i> Orders
            </a>
          </li>
          <li class="admin-sidebar__item">
            <a href="#" class="admin-sidebar__link">
              <i data-lucide="package"></i> Products
            </a>
          </li>
          <li class="admin-sidebar__item">
            <a href="#" class="admin-sidebar__link">
              <i data-lucide="users"></i> Customers
            </a>
          </li>
          <li class="admin-sidebar__item">
            <a href="#" class="admin-sidebar__link">
              <i data-lucide="bar-chart-3"></i> Analytics
            </a>
          </li>
          <li class="admin-sidebar__item">
            <a href="#" class="admin-sidebar__link">
              <i data-lucide="settings"></i> Settings
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  `;

  container.innerHTML = sidebarHTML;

  // Re-initialize Lucide icons for the newly injected HTML
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Handle close event
  const closeBtn = container.querySelector('.js-sidebar-close');
  const sidebarEl = container.querySelector('.js-admin-sidebar-el');
  
  if (closeBtn && sidebarEl) {
    closeBtn.addEventListener('click', () => {
      sidebarEl.classList.remove('admin-sidebar--open');
    });
  }
}
