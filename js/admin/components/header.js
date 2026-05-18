/**
 * Initializes the admin header component and injects it into the DOM.
 * 
 * @param {HTMLElement} container - The DOM element where the header should be rendered.
 */
export function initHeader(container) {
  if (!container) return;

  const headerHTML = `
    <header class="admin-header">
      <button class="admin-header__toggle js-sidebar-toggle" aria-label="Toggle sidebar">
        <i data-lucide="menu"></i>
      </button>
      
      <div class="admin-header__right">
        <button class="admin-dashboard__btn" aria-label="Notifications" style="padding: 8px; border: none; box-shadow: none;">
          <i data-lucide="bell" style="width: 20px; height: 20px; color: #999;"></i>
        </button>
        <div class="admin-header__user">
          <img src="./assets/images/pic-profile-demo.jpg" alt="Admin" onerror="this.src='https://ui-avatars.com/api/?name=Admin&background=random'">
          <span>Admin</span>
        </div>
      </div>
    </header>
  `;

  container.innerHTML = headerHTML;

  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Handle toggle event
  const toggleBtn = container.querySelector('.js-sidebar-toggle');
  
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      // The sidebar is rendered in a different container, so we query it globally
      const sidebarEl = document.querySelector('.js-admin-sidebar-el');
      if (sidebarEl) {
        sidebarEl.classList.add('admin-sidebar--open');
      }
    });
  }
}
