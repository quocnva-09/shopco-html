import { UserDTO } from "../../models/user.dto.js";

/**
 * Initializes the admin header component and injects it into the DOM.
 * 
 * @param {HTMLElement} container - The DOM element where the header should be rendered.
 */
export function initHeader(container) {
  if (!container) return;

  const userStorage = JSON.parse(localStorage.getItem('user')) || {};
  const user = new UserDTO(userStorage);
  

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
          <img src="${user.avatar}" alt="${user.name}">
          <span>${user.name}</span>
        </div>
        <button class="admin-header__logout js-logout-btn" aria-label="Logout">
          <i data-lucide="log-out"></i>
        </button>
      </div>
    </header>
  `;

  container.innerHTML = headerHTML;

  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Handle toggle event
  const toggleBtn = container.querySelector('.js-sidebar-toggle');
  const logoutBtn = container.querySelector('.js-logout-btn');
  
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      // The sidebar is rendered in a different container, so we query it globally
      const sidebarEl = document.querySelector('.js-admin-sidebar-el');
      if (sidebarEl) {
        sidebarEl.classList.add('admin-sidebar--open');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      window.location.href = '/auth.html';
    });
  }
}
