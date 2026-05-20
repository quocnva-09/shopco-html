/**
 * User Table Module
 *
 * Main entry point for the Admin User Management page.
 * Responsibilities:
 *  - Render toolbar (search + tabs + Create button)
 *  - Render data table with avatar, badge, action buttons
 *  - Manage tab/search/sort/page state
 *  - Handle all row-level actions via event delegation
 *  - Render pagination controls
 *  - Render delete confirm dialog
 *
 * @module user-table
 */

import { UserService } from '../../services/user.service.js';
import { showToast } from './user-toast.js';

let onCreateUserCallback = null;
let onEditUserCallback = null;

// ─────────────────────────────────────────────────────────────
// State
// ─────────────────────────────────────────────────────────────

/** @type {{ tab: string, query: string, page: number, perPage: number, totalPages: number }} */
const state = {
  tab: 'active',
  query: '',
  page: 1,
  perPage: 10,
  totalPages: 1,
};

// ─────────────────────────────────────────────────────────────
// DOM refs (populated on init)
// ─────────────────────────────────────────────────────────────
let containerEl = null;
let tbodyEl = null;
let paginationEl = null;
let searchInputEl = null;

// ─────────────────────────────────────────────────────────────
// Public entry point
// ─────────────────────────────────────────────────────────────

/**
 * Initializes the User Table module.
 * Must be called once with the wrapper container element.
 *
 * @param {HTMLElement} container
 * @param {Object} options
 * @param {Function} [options.onCreateUser]
 * @param {Function} [options.onEditUser]
 */
export function initUserTable(container, options = {}) {
  if (!container) return;
  
  onCreateUserCallback = options.onCreateUser || null;
  onEditUserCallback = options.onEditUser || null;
  containerEl = container;

  // Render structural shell
  container.innerHTML = buildShellHTML();

  // Cache DOM refs
  tbodyEl = container.querySelector('.js-user-tbody');
  paginationEl = container.querySelector('.js-user-pagination');
  searchInputEl = container.querySelector('.js-user-search');

  // Bind toolbar events
  bindToolbarEvents(container);

  // Bind table event delegation
  bindTableEvents(container);

  // Bind confirm dialog
  bindConfirmDialog(container);

  // Initial data load
  refreshTable();

  // Re-initialize Lucide icons
  if (window.lucide) window.lucide.createIcons();
}

// ─────────────────────────────────────────────────────────────
// HTML builders
// ─────────────────────────────────────────────────────────────

/**
 * Builds the full page shell: toolbar + table wrapper + pagination + confirm dialog.
 *
 * @returns {string}
 */
function buildShellHTML() {
  return `
    <div class="user-toolbar">
      <div class="user-toolbar__search">
        <span class="user-toolbar__search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </span>
        <input
          class="user-toolbar__input js-user-search"
          type="search"
          id="user-search-input"
          placeholder="Search by name or email…"
          autocomplete="off"
          aria-label="Search users"
        >
      </div>

      <div class="user-toolbar__tabs" role="tablist" aria-label="User filter tabs">
        <button class="user-toolbar__tab user-toolbar__tab--active js-tab-btn" data-tab="active" role="tab" aria-selected="true" id="tab-active">Active</button>
        <button class="user-toolbar__tab js-tab-btn" data-tab="trashed" role="tab" aria-selected="false" id="tab-trashed">Trash</button>
      </div>

      <div class="user-toolbar__actions">
        <button class="admin-btn admin-btn--primary js-create-user-btn" id="create-user-btn" type="button">
          + Create User
        </button>
      </div>
    </div>

    <div class="admin-table-wrapper">
      <table class="admin-table user-table" aria-label="Users table">
        <thead>
          <tr>
            <th scope="col">User</th>
            <th scope="col">Role</th>
            <th scope="col">Phone</th>
            <th scope="col">Joined</th>
            <th scope="col" class="user-table__actions-col">Actions</th>
          </tr>
        </thead>
        <tbody class="js-user-tbody" id="user-tbody">
          ${buildSkeletonRows(5)}
        </tbody>
      </table>
    </div>

    <div class="user-pagination js-user-pagination" id="user-pagination" role="navigation" aria-label="Pagination"></div>

    <!-- Confirm Delete / Force Delete Dialog -->
    <div class="user-confirm js-user-confirm" id="user-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div class="user-confirm__panel">
        <h3 class="user-confirm__title" id="confirm-title">Confirm Action</h3>
        <p class="user-confirm__message js-confirm-message">Are you sure you want to proceed?</p>
        <div class="user-confirm__footer">
          <button class="admin-btn admin-btn--ghost js-confirm-cancel" type="button" id="confirm-cancel-btn">Cancel</button>
          <button class="admin-btn admin-btn--danger js-confirm-ok" type="button" id="confirm-ok-btn">Confirm</button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Builds skeleton loading rows for the initial table state.
 *
 * @param {number} count - Number of skeleton rows to render.
 * @returns {string}
 */
function buildSkeletonRows(count) {
  const row = `
    <tr>
      <td><div class="user-skeleton__cell" style="width:180px"></div></td>
      <td><div class="user-skeleton__cell" style="width:60px"></div></td>
      <td><div class="user-skeleton__cell" style="width:110px"></div></td>
      <td><div class="user-skeleton__cell" style="width:90px"></div></td>
      <td><div class="user-skeleton__cell" style="width:70px; margin-left:auto"></div></td>
    </tr>`;
  return Array(count).fill(row).join('');
}

/**
 * Builds table rows for active users.
 *
 * @param {UserDTO[]} users
 * @returns {string}
 */
function buildActiveRows(users) {
  return users.map(user => `
    <tr>
      <td>
        <div class="user-table__name-cell">
          ${buildAvatar(user)}
          <div class="user-table__meta">
            <span>${escapeHtml(user.name)}</span>
            <span class="user-table__email">${escapeHtml(user.email)}</span>
          </div>
        </div>
      </td>
      <td>
        <span class="admin-badge admin-badge--${user.role === 'admin' ? 'danger' : 'neutral'}">
          ${escapeHtml(user.role)}
        </span>
      </td>
      <td>${escapeHtml(user.phone !== 'No phone' ? user.phone : '—')}</td>
      <td>${formatDate(user.createdAt)}</td>
      <td>
        <div class="user-actions">
          <button
            class="user-action-btn js-edit-user"
            type="button"
            data-id="${user.id}"
            data-name="${escapeHtml(user.name)}"
            data-email="${escapeHtml(user.email)}"
            data-phone="${escapeHtml(user.phone)}"
            data-address="${escapeHtml(user.address)}"
            data-bio="${escapeHtml(user.bio)}"
            data-role="${escapeHtml(user.role)}"
            aria-label="Edit ${escapeHtml(user.name)}"
            title="Edit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button
            class="user-action-btn user-action-btn--danger js-delete-user"
            type="button"
            data-id="${user.id}"
            data-name="${escapeHtml(user.name)}"
            aria-label="Delete ${escapeHtml(user.name)}"
            title="Move to Trash"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

/**
 * Builds table rows for trashed users.
 *
 * @param {UserDTO[]} users
 * @returns {string}
 */
function buildTrashedRows(users) {
  return users.map(user => `
    <tr>
      <td>
        <div class="user-table__name-cell">
          ${buildAvatar(user)}
          <div class="user-table__meta">
            <span>${escapeHtml(user.name)}</span>
            <span class="user-table__email">${escapeHtml(user.email)}</span>
          </div>
        </div>
      </td>
      <td>
        <span class="admin-badge admin-badge--${user.role === 'admin' ? 'danger' : 'neutral'}">
          ${escapeHtml(user.role)}
        </span>
      </td>
      <td>${escapeHtml(user.phone !== 'No phone' ? user.phone : '—')}</td>
      <td>${formatDate(user.createdAt)}</td>
      <td>
        <div class="user-actions">
          <button
            class="user-action-btn user-action-btn--success js-restore-user"
            type="button"
            data-id="${user.id}"
            data-name="${escapeHtml(user.name)}"
            aria-label="Restore ${escapeHtml(user.name)}"
            title="Restore"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>
          </button>
          <button
            class="user-action-btn user-action-btn--danger js-force-delete-user"
            type="button"
            data-id="${user.id}"
            data-name="${escapeHtml(user.name)}"
            aria-label="Permanently delete ${escapeHtml(user.name)}"
            title="Permanently Delete"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/><path d="M9 3h6"/><path d="M4 6h16"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

/**
 * Builds an avatar element — img tag if URL available, else initials fallback.
 *
 * @param {UserDTO} user
 * @returns {string}
 */
function buildAvatar(user) {
  if (user.avatar && user.avatar !== 'No avatar') {
    return `<span class="user-avatar"><img src="${escapeHtml(user.avatar)}" alt="${escapeHtml(user.name)}" loading="lazy"></span>`;
  }
  const initials = user.name
    .split(' ')
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase();
  return `<span class="user-avatar">${initials}</span>`;
}

/**
 * Builds pagination controls.
 *
 * @param {{ current_page: number, last_page: number, total: number, per_page: number }} meta
 * @returns {string}
 */
function buildPaginationHTML(meta) {
  if (!meta || meta.last_page <= 1) return '';

  const { current_page: current, last_page: total } = meta;

  let pages = '';
  for (let i = 1; i <= total; i++) {
    // Show first, last, and pages within 2 of current
    if (i === 1 || i === total || Math.abs(i - current) <= 1) {
      pages += `
        <button
          class="user-pagination__btn${i === current ? ' user-pagination__btn--active' : ''} js-page-btn"
          type="button"
          data-page="${i}"
          aria-label="Page ${i}"
          ${i === current ? 'aria-current="page"' : ''}
        >${i}</button>`;
    } else if (Math.abs(i - current) === 2) {
      pages += `<span class="user-pagination__ellipsis">…</span>`;
    }
  }

  return `
    <button class="user-pagination__btn js-prev-btn" type="button" aria-label="Previous page" ${current <= 1 ? 'disabled' : ''}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
    </button>
    ${pages}
    <button class="user-pagination__btn js-next-btn" type="button" aria-label="Next page" ${current >= total ? 'disabled' : ''}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
    </button>
    <span class="user-pagination__info">Page ${current} of ${total}</span>
  `;
}

/**
 * Builds empty state row HTML.
 *
 * @param {string} [message='No users found.']
 * @returns {string}
 */
function buildEmptyRow(message = 'No users found.') {
  return `
    <tr>
      <td colspan="5">
        <div class="user-empty">
          <span class="user-empty__icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </span>
          <span class="user-empty__text">${message}</span>
        </div>
      </td>
    </tr>`;
}

// ─────────────────────────────────────────────────────────────
// Data loading & rendering
// ─────────────────────────────────────────────────────────────

/**
 * Refreshes the table by re-fetching data with current state.
 */
async function refreshTable() {
  tbodyEl.innerHTML = buildSkeletonRows(5);
  paginationEl.innerHTML = '';

  const params = {
    page: state.page,
    per_page: state.perPage,
    ...(state.query ? { search: state.query } : {}),
  };

  const { users, meta, error } = state.tab === 'active'
    ? await UserService.fetchUsers(params)
    : await UserService.fetchTrashedUsers(params);

  if (error) {
    tbodyEl.innerHTML = buildEmptyRow(`Error loading users: ${error}`);
    showToast({ message: error, type: 'error' });
    return;
  }

  if (users.length === 0) {
    const emptyMsg = state.tab === 'trashed' ? 'No trashed users.' : 'No users found.';
    tbodyEl.innerHTML = buildEmptyRow(emptyMsg);
  } else {
    tbodyEl.innerHTML = state.tab === 'active'
      ? buildActiveRows(users)
      : buildTrashedRows(users);
  }

  paginationEl.innerHTML = buildPaginationHTML(meta);
  state.totalPages = meta?.last_page ?? 1;

  // Re-run Lucide for any injected icons
  if (window.lucide) window.lucide.createIcons();
}

// ─────────────────────────────────────────────────────────────
// Event binding
// ─────────────────────────────────────────────────────────────

/**
 * Binds toolbar interaction events: search (debounced), tabs, create button.
 *
 * @param {HTMLElement} container
 */
function bindToolbarEvents(container) {
  // Search with debounce
  searchInputEl.addEventListener('input', debounce(() => {
    state.query = searchInputEl.value.trim();
    state.page = 1;
    refreshTable();
  }, 300));

  // Tab switching
  container.addEventListener('click', (e) => {
    const tabBtn = e.target.closest('.js-tab-btn');
    if (!tabBtn) return;

    const selectedTab = tabBtn.dataset.tab;
    if (selectedTab === state.tab) return;

    // Update tab state
    state.tab = selectedTab;
    state.page = 1;

    // Update ARIA and active class
    container.querySelectorAll('.js-tab-btn').forEach(btn => {
      const isActive = btn.dataset.tab === selectedTab;
      btn.classList.toggle('user-toolbar__tab--active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    });

    refreshTable();
  });

  // Create user button
  container.addEventListener('click', (e) => {
    if (e.target.closest('.js-create-user-btn')) {
      if (onCreateUserCallback) onCreateUserCallback();
    }
  });
}

/**
 * Binds table row action events via delegation on the container.
 *
 * @param {HTMLElement} container
 */
function bindTableEvents(container) {
  container.addEventListener('click', async (e) => {
    // Edit
    const editBtn = e.target.closest('.js-edit-user');
    if (editBtn) {
      const { id, name, email, phone, address, bio, role } = editBtn.dataset;
      if (onEditUserCallback) onEditUserCallback({ id, name, email, phone, address, bio, role });
      return;
    }

    // Soft delete
    const deleteBtn = e.target.closest('.js-delete-user');
    if (deleteBtn) {
      showConfirm(
        `Move "${deleteBtn.dataset.name}" to trash?`,
        async () => {
          const { error } = await UserService.trashUser(deleteBtn.dataset.id);
          if (error) {
            showToast({ message: error, type: 'error' });
          } else {
            showToast({ message: 'User moved to trash.', type: 'warning' });
            refreshTable();
          }
        }
      );
      return;
    }

    // Restore
    const restoreBtn = e.target.closest('.js-restore-user');
    if (restoreBtn) {
      const { error } = await UserService.recoverUser(restoreBtn.dataset.id);
      if (error) {
        showToast({ message: error, type: 'error' });
      } else {
        showToast({ message: `"${restoreBtn.dataset.name}" restored.`, type: 'success' });
        refreshTable();
      }
      return;
    }

    // Force delete
    const forceDeleteBtn = e.target.closest('.js-force-delete-user');
    if (forceDeleteBtn) {
      showConfirm(
        `Permanently delete "${forceDeleteBtn.dataset.name}"? This cannot be undone.`,
        async () => {
          const { error } = await UserService.destroyUser(forceDeleteBtn.dataset.id);
          if (error) {
            showToast({ message: error, type: 'error' });
          } else {
            showToast({ message: 'User permanently deleted.', type: 'success' });
            refreshTable();
          }
        }
      );
      return;
    }

    // Pagination: prev
    if (e.target.closest('.js-prev-btn') && state.page > 1) {
      state.page -= 1;
      refreshTable();
      return;
    }

    // Pagination: next
    if (e.target.closest('.js-next-btn') && state.page < state.totalPages) {
      state.page += 1;
      refreshTable();
      return;
    }

    // Pagination: specific page
    const pageBtn = e.target.closest('.js-page-btn');
    if (pageBtn) {
      const targetPage = parseInt(pageBtn.dataset.page, 10);
      if (!Number.isNaN(targetPage) && targetPage !== state.page) {
        state.page = targetPage;
        refreshTable();
      }
    }
  });
}

// ─────────────────────────────────────────────────────────────
// Confirm Dialog
// ─────────────────────────────────────────────────────────────

let confirmCallback = null;

/**
 * Displays the confirm dialog with a custom message.
 *
 * @param {string} message
 * @param {function} onConfirm - Async callback when user confirms.
 */
function showConfirm(message, onConfirm) {
  const dialog = containerEl.querySelector('.js-user-confirm');
  const msgEl = containerEl.querySelector('.js-confirm-message');
  if (!dialog || !msgEl) return;

  msgEl.textContent = message;
  confirmCallback = onConfirm;
  dialog.classList.add('user-confirm--open');
}

/**
 * Hides the confirm dialog and clears the pending callback.
 */
function hideConfirm() {
  const dialog = containerEl.querySelector('.js-user-confirm');
  if (dialog) dialog.classList.remove('user-confirm--open');
  confirmCallback = null;
}

/**
 * Binds cancel and confirm button events inside the confirm dialog.
 *
 * @param {HTMLElement} container
 */
function bindConfirmDialog(container) {
  container.addEventListener('click', async (e) => {
    if (e.target.closest('.js-confirm-cancel')) {
      hideConfirm();
      return;
    }

    const okBtn = e.target.closest('.js-confirm-ok');
    if (okBtn) {
      hideConfirm();
      if (typeof confirmCallback === 'function') {
        await confirmCallback();
        confirmCallback = null;
      }
    }
  });
}

// ─────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────

/**
 * Debounces a function call.
 *
 * @param {function} fn - Function to debounce.
 * @param {number} delay - Delay in milliseconds.
 * @returns {function}
 */
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Escapes HTML special characters to prevent XSS.
 *
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Formats a date string into a human-readable short date.
 *
 * @param {string|null} dateStr
 * @returns {string}
 */
function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

/**
 * Publicly expose refreshTable so the parent module can call it.
 */
export async function refreshUserTable() {
  return refreshTable();
}
