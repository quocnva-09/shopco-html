import { escapeHtml, formatDate, buildProductImage } from '../../utils/table-layout.util.js';

export function buildProductRow(product) {
  const categoryName = product.category ? product.category.name : 'Uncategorized';

  return `
    <tr>
      <td>
        <div class="data-table__name-cell">
          ${buildProductImage(product)}
          <div class="data-table__meta">
            <span>${escapeHtml(product.name)}</span>
            <span class="data-table__email">${escapeHtml(product.slug)}</span>
          </div>
        </div>
      </td>
      <td>
        <div>$${product.currentPrice}</div>
        ${product.originalPrice > product.currentPrice ? `<div style="text-decoration: line-through; color: #9ca3af; font-size: 12px;">$${product.originalPrice}</div>` : ''}
      </td>
      <td>${escapeHtml(categoryName)}</td>
      <td>
        <span style="display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 12px; background: ${product.is_active ? '#dcfce3' : '#f3f4f6'}; color: ${product.is_active ? '#166534' : '#374151'};">
          ${product.is_active ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td>
        <div class="action-group">
          <button
            class="action-btn js-table-action"
            type="button"
            data-action="edit"
            data-id="${product.id}"
            data-name="${escapeHtml(product.name)}"
            data-slug="${escapeHtml(product.slug)}"
            data-description="${escapeHtml(product.description)}"
            data-price="${product.originalPrice}"
            data-price_discount="${product.currentPrice}"
            data-is_active="${product.is_active}"
            data-category_id="${product.category ? product.category.id : ''}"
            aria-label="Edit ${escapeHtml(product.name)}"
            title="Edit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button
            class="action-btn action-btn--danger js-table-action"
            type="button"
            data-action="delete"
            data-id="${product.id}"
            data-name="${escapeHtml(product.name)}"
            aria-label="Delete ${escapeHtml(product.name)}"
            title="Move to Trash"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `;
}

export function buildTrashedProductRow(product) {
  const categoryName = product.category ? product.category.name : 'Uncategorized';
  
  return `
    <tr>
      <td>
        <div class="data-table__name-cell">
          <img src="${escapeHtml(product.primaryImage)}" alt="${escapeHtml(product.name)}" class="data-table__avatar" style="border-radius: 4px; object-fit: cover;">
          <div class="data-table__meta">
            <span>${escapeHtml(product.name)}</span>
            <span class="data-table__email">${escapeHtml(product.slug)}</span>
          </div>
        </div>
      </td>
      <td>
        <div>$${product.currentPrice}</div>
      </td>
      <td>${escapeHtml(categoryName)}</td>
      <td>${formatDate(product.updated_at || product.created_at)}</td>
      <td>
        <div class="action-group">
          <button
            class="action-btn action-btn--success js-table-action"
            type="button"
            data-action="restore"
            data-id="${product.id}"
            data-name="${escapeHtml(product.name)}"
            aria-label="Restore ${escapeHtml(product.name)}"
            title="Restore"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>
          </button>
          <button
            class="action-btn action-btn--danger js-table-action"
            type="button"
            data-action="force-delete"
            data-id="${product.id}"
            data-name="${escapeHtml(product.name)}"
            aria-label="Permanently delete ${escapeHtml(product.name)}"
            title="Permanently Delete"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/><path d="M9 3h6"/><path d="M4 6h16"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `;
}
