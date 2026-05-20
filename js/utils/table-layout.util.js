export function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function formatDate(dateStr) {
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

export function buildProductImage(product) {
  if (product.images && product.images.length > 0) {
    return `<span class="user-avatar"><img src="${escapeHtml(product.images[0].img_path)}" alt="${escapeHtml(product.name)}" loading="lazy"></span>`;
  }
  const initials = (product.name || 'U')
    .split(' ')
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase();
  return `<span class="user-avatar">${initials}</span>`;
}