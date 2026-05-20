/**
 * Generic Table Layout
 * Provides HTML builder functions for the generic data table.
 */

export function buildTableToolbarHTML(searchPlaceholder = 'Search…', actionBtnText = '+ Create', actionBtnId = 'create-btn') {
  return `
    <div class="toolbar js-toolbar">
      <div class="toolbar__search">
        <span class="toolbar__search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </span>
        <input
          class="toolbar__input js-table-search"
          type="search"
          placeholder="${searchPlaceholder}"
          autocomplete="off"
          aria-label="Search"
        >
      </div>

      <div class="toolbar__tabs" role="tablist" aria-label="Filter tabs">
        <button class="toolbar__tab toolbar__tab--active js-tab-btn" data-tab="active" role="tab" aria-selected="true">Active</button>
        <button class="toolbar__tab js-tab-btn" data-tab="trashed" role="tab" aria-selected="false">Trash</button>
      </div>

      <div class="toolbar__actions">
        <button class="admin-btn admin-btn--primary js-create-btn" id="${actionBtnId}" type="button">
          ${actionBtnText}
        </button>
      </div>
    </div>
  `;
}

export function buildTableWrapperHTML(columns) {
  const theadHtml = columns.map(col => {
    if (typeof col === 'object') {
      const className = col.className ? ` class="${col.className}"` : '';
      return `<th scope="col"${className}>${col.label || ''}</th>`;
    }
    return `<th scope="col">${col}</th>`;
  }).join('');

  return `
    <div class="admin-table-wrapper">
      <table class="admin-table data-table" aria-label="Data table">
        <thead>
          <tr>
            ${theadHtml}
          </tr>
        </thead>
        <tbody class="js-table-tbody">
        </tbody>
      </table>
    </div>
  `;
}

export function buildPaginationHTML(meta) {
  if (!meta || meta.last_page <= 1) return '';

  const { current_page: current, last_page: total } = meta;

  let pages = '';
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - current) <= 1) {
      pages += `
        <button
          class="pagination__btn${i === current ? ' pagination__page--active' : ''} js-page-btn"
          type="button"
          data-page="${i}"
          aria-label="Page ${i}"
          ${i === current ? 'aria-current="page"' : ''}
        >${i}</button>`;
    } else if (Math.abs(i - current) === 2) {
      pages += `<span class="pagination__dots">…</span>`;
    }
  }

  return `
    <div class="pagination js-table-pagination" role="navigation" aria-label="Pagination">
      <button class="pagination__btn js-prev-btn" type="button" aria-label="Previous page" ${current <= 1 ? 'disabled' : ''}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div class="pagination__pages">
        ${pages}
      </div>
      <button class="pagination__btn js-next-btn" type="button" aria-label="Next page" ${current >= total ? 'disabled' : ''}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
      <span class="pagination__info">Page ${current} of ${total}</span>
    </div>
  `;
}

export function buildConfirmDialogHTML() {
  return `
    <div class="confirm-dialog js-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div class="confirm-dialog__panel">
        <h3 class="confirm-dialog__title" id="confirm-title">Confirm Action</h3>
        <p class="confirm-dialog__message js-confirm-message">Are you sure you want to proceed?</p>
        <div class="confirm-dialog__footer">
          <button class="admin-btn admin-btn--ghost js-confirm-cancel" type="button">Cancel</button>
          <button class="admin-btn admin-btn--danger js-confirm-ok" type="button">Confirm</button>
        </div>
      </div>
    </div>
  `;
}

export function buildSkeletonRows(rowCount, colCount) {
  const tds = Array(colCount).fill('<td><div class="skeleton__cell"></div></td>').join('');
  const row = `<tr>${tds}</tr>`;
  return Array(rowCount).fill(row).join('');
}

export function buildEmptyRow(message, colCount) {
  return `
    <tr>
      <td colspan="${colCount}">
        <div class="empty-state">
          <span class="empty-state__icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </span>
          <span class="empty-state__text">${message}</span>
        </div>
      </td>
    </tr>`;
}
