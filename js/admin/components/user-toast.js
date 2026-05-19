/**
 * User Toast Notification Module
 *
 * Manages a fixed bottom-right toast container and provides
 * a showToast() utility. Toasts auto-dismiss after 3 seconds.
 */

// Icon SVG map for each toast type
const TOAST_ICONS = {
  success: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  error:   '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
  warning: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
};

const TOAST_DURATION = 3000; // ms before auto-dismiss
let toastContainer = null;

/**
 * Lazily creates and returns the singleton toast container element.
 *
 * @returns {HTMLElement} The .user-toast container appended to <body>.
 */
function getContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'user-toast';
    toastContainer.setAttribute('aria-live', 'polite');
    toastContainer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

/**
 * Displays a toast notification.
 *
 * @param {{ message: string, type?: 'success' | 'error' | 'warning' }} options
 */
export function showToast({ message, type = 'success' }) {
  const container = getContainer();

  const item = document.createElement('div');
  item.className = `user-toast__item user-toast__item--${type}`;
  item.setAttribute('role', 'alert');
  item.innerHTML = `
    <span class="user-toast__icon">${TOAST_ICONS[type] || ''}</span>
    <span class="user-toast__message">${message}</span>
  `;

  container.appendChild(item);

  // Auto-dismiss
  setTimeout(() => dismissToast(item), TOAST_DURATION);
}

/**
 * Animates and removes a toast item from the DOM.
 *
 * @param {HTMLElement} item - The toast item element to dismiss.
 */
function dismissToast(item) {
  if (!item || !item.parentNode) return;

  item.classList.add('user-toast__item--exit');

  item.addEventListener('animationend', () => {
    if (item.parentNode) {
      item.parentNode.removeChild(item);
    }
  }, { once: true });
}
