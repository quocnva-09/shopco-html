/**
 * Admin Sidebar Component
 *
 * Injects the sidebar HTML, re-initializes Lucide icons,
 * and automatically sets the active nav link based on the current page.
 *
 * Active-link detection uses the page filename mapped against a config table.
 * Each entry maps a pathname fragment → the js- selector of the nav link to activate.
 */

// ─────────────────────────────────────────────────────────────
// Nav route config
// Maps page filename fragments to the corresponding js-nav-* class.
// ─────────────────────────────────────────────────────────────

/**
 * @type {Array<{ match: string, selector: string }>}
 */
const NAV_ROUTES = [
  { match: 'admin/dashboard', selector: '.js-nav-overview' },
  { match: 'admin/orders', selector: '.js-nav-orders' },
  { match: 'admin/products', selector: '.js-nav-products' },
  { match: 'admin/users', selector: '.js-nav-users' },
  { match: 'admin/categories', selector: '.js-nav-categories' },
  { match: 'admin/reviews', selector: '.js-nav-reviews' },
  { match: 'admin/exports', selector: '.js-nav-exports' },
];

// ─────────────────────────────────────────────────────────────
// Sidebar HTML template
// ─────────────────────────────────────────────────────────────

/** @returns {string} */
function buildSidebarHTML() {
  return `
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
            <a href="dashboard.html" class="admin-sidebar__link js-nav-overview">
              <i data-lucide="layout-dashboard"></i> Overview
            </a>
          </li>
          <li class="admin-sidebar__item">
            <a href="orders.html" class="admin-sidebar__link js-nav-orders">
              <i data-lucide="shopping-cart"></i> Orders
            </a>
          </li>
          <li class="admin-sidebar__item">
            <a href="products.html" class="admin-sidebar__link js-nav-products">
              <i data-lucide="package"></i> Products
            </a>
          </li>
          <li class="admin-sidebar__item">
            <a href="users.html" class="admin-sidebar__link js-nav-users">
              <i data-lucide="users"></i> Users
            </a>
          </li>
          <li class="admin-sidebar__item">
            <a href="categories.html" class="admin-sidebar__link js-nav-categories">
              <i data-lucide="tag"></i> Categories
            </a>
          </li>
          <li class="admin-sidebar__item">
            <a href="reviews.html" class="admin-sidebar__link js-nav-reviews">
              <i data-lucide="star"></i> Reviews
            </a>
          </li>
          <li class="admin-sidebar__item">
            <a href="exports.html" class="admin-sidebar__link js-nav-exports">
              <i data-lucide="download-cloud"></i> Exports
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  `;
}

// ─────────────────────────────────────────────────────────────
// Active-link detection
// ─────────────────────────────────────────────────────────────

/**
 * Returns the nav selector that matches the current page pathname,
 * or null if no match is found (defaults to Overview).
 *
 * @returns {string|null}
 */
function resolveActiveSelector() {
  const path = window.location.pathname;

  for (const route of NAV_ROUTES) {
    if (path.includes(route.match)) {
      return route.selector;
    }
  }

  return null; // Falls back to Overview
}

/**
 * Applies the --active modifier to the correct nav link.
 * Removes any hardcoded active class first to avoid duplicates.
 *
 * @param {HTMLElement} container
 */
function setActiveNavLink(container) {
  // Clear all active states
  container.querySelectorAll('.admin-sidebar__link').forEach((link) => {
    link.classList.remove('admin-sidebar__link--active');
  });

  const selector = resolveActiveSelector();

  const activeLink = selector
    ? container.querySelector(selector)
    : container.querySelector('.js-nav-overview');

  if (activeLink) {
    activeLink.classList.add('admin-sidebar__link--active');
  }
}


/**
 * Initializes the admin sidebar component.
 * Injects HTML, sets the active nav link, re-runs Lucide icons,
 * and binds the mobile close button.
 *
 * @param {HTMLElement} container - Wrapper element (e.g. .js-admin-sidebar-container).
 */
export function initSidebar(container) {
  if (!container) return;

  container.innerHTML = buildSidebarHTML();

  // Set active link based on current page
  setActiveNavLink(container);

  // Re-initialize Lucide icons for newly injected HTML
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Mobile close button
  const closeBtn = container.querySelector('.js-sidebar-close');
  const sidebarEl = container.querySelector('.js-admin-sidebar-el');

  if (closeBtn && sidebarEl) {
    closeBtn.addEventListener('click', () => {
      sidebarEl.classList.remove('admin-sidebar--open');
    });
  }
}
