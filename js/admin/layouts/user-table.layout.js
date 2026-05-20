function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export function buildAvatar(user) {
  if (user.avatar && user.avatar !== 'No avatar') {
    return `<span class="user-avatar"><img src="${escapeHtml(user.avatar)}" alt="${escapeHtml(user.name)}" loading="lazy"></span>`;
  }
  const initials = (user.name || 'U')
    .split(' ')
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase();
  return `<span class="user-avatar">${initials}</span>`;
}

export function buildUserRow(user) {
  return `
    <tr>
      <td>
        <div class="data-table__name-cell">
          ${buildAvatar(user)}
          <div class="data-table__meta">
            <span>${escapeHtml(user.name)}</span>
            <span class="data-table__email">${escapeHtml(user.email)}</span>
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
        <div class="action-group">
          <button
            class="action-btn js-table-action"
            type="button"
            data-action="edit"
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
            class="action-btn action-btn--danger js-table-action"
            type="button"
            data-action="delete"
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
  `;
}

export function buildTrashedUserRow(user) {
  return `
    <tr>
      <td>
        <div class="data-table__name-cell">
          ${buildAvatar(user)}
          <div class="data-table__meta">
            <span>${escapeHtml(user.name)}</span>
            <span class="data-table__email">${escapeHtml(user.email)}</span>
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
        <div class="action-group">
          <button
            class="action-btn action-btn--success js-table-action"
            type="button"
            data-action="restore"
            data-id="${user.id}"
            data-name="${escapeHtml(user.name)}"
            aria-label="Restore ${escapeHtml(user.name)}"
            title="Restore"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>
          </button>
          <button
            class="action-btn action-btn--danger js-table-action"
            type="button"
            data-action="force-delete"
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
  `;
}
