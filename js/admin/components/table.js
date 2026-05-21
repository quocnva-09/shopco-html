import {
  buildTableToolbarHTML,
  buildTableWrapperHTML,
  buildPaginationHTML,
  buildConfirmDialogHTML,
  buildSkeletonRows,
  buildEmptyRow
} from '../layouts/table.layout.js';

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Generic Data Table Component
 * Manages state, layout injection, event delegation, and data fetching for admin tables.
 */
export class DataTable {
  constructor(container, options = {}) {
    if (!container) throw new Error("DataTable requires a container element.");

    this.container = container;
    this.options = {
      columns: [],
      searchPlaceholder: 'Search…',
      actionBtnText: '+ Create',
      fetchData: async () => ({ items: [], meta: null }),
      renderRow: () => '',
      onAction: () => {},
      ...options
    };

    // State
    this.state = {
      tab: 'active',
      query: '',
      page: 1,
      perPage: 10,
    };

    // DOM Refs
    this.tbodyEl = null;
    this.paginationEl = null;
    this.searchInputEl = null;
    this.confirmDialog = null;

    this.init();
  }

  init() {
    this._renderShell();
    this._cacheDOM();
    this._bindEvents();
    this.refresh();
  }

  _renderShell() {
    const { columns, searchPlaceholder, actionBtnText, exportBtnText } = this.options;
    
    this.container.innerHTML = `
      ${buildTableToolbarHTML(searchPlaceholder, actionBtnText, 'table-create-btn', exportBtnText)}
      ${buildTableWrapperHTML(columns)}
      <div class="js-table-pagination-container"></div>
      ${buildConfirmDialogHTML()}
    `;
  }

  _cacheDOM() {
    this.tbodyEl = this.container.querySelector('.js-table-tbody');
    this.paginationContainerEl = this.container.querySelector('.js-table-pagination-container');
    this.searchInputEl = this.container.querySelector('.js-table-search');
    this.confirmDialog = this.container.querySelector('.js-confirm-dialog');
  }

  _bindEvents() {
    // Toolbar: Search
    if (this.searchInputEl) {
      this.searchInputEl.addEventListener('input', debounce(() => {
        this.state.query = this.searchInputEl.value.trim();
        this.state.page = 1;
        this.refresh();
      }, 300));
    }

    // Toolbar: Tabs
    this.container.addEventListener('click', (e) => {
      const tabBtn = e.target.closest('.js-tab-btn');
      if (tabBtn) {
        const selectedTab = tabBtn.dataset.tab;
        if (selectedTab !== this.state.tab) {
          this.state.tab = selectedTab;
          this.state.page = 1;

          this.container.querySelectorAll('.js-tab-btn').forEach(btn => {
            const isActive = btn.dataset.tab === selectedTab;
            btn.classList.toggle('toolbar__tab--active', isActive);
            btn.setAttribute('aria-selected', String(isActive));
          });

          this.refresh();
        }
      }
    });

    // Toolbar: Create
    this.container.addEventListener('click', (e) => {
      if (e.target.closest('.js-create-btn')) {
        this.options.onAction('create', null);
      }
    });

    // Toolbar: Export
    this.container.addEventListener('click', (e) => {
      if (e.target.closest('.js-export-btn')) {
        this.options.onAction('export', null);
      }
    });

    // Table: Row Actions
    this.container.addEventListener('click', (e) => {
      const actionBtn = e.target.closest('.js-table-action');
      if (actionBtn) {
        const action = actionBtn.dataset.action;
        this.options.onAction(action, actionBtn.dataset);
      }
    });

    // Pagination
    this.container.addEventListener('click', (e) => {
      const pageBtn = e.target.closest('.js-page-btn');
      if (pageBtn) {
        this.state.page = parseInt(pageBtn.dataset.page, 10);
        this.refresh();
        return;
      }
      const prevBtn = e.target.closest('.js-prev-btn');
      if (prevBtn && !prevBtn.disabled) {
        this.state.page--;
        this.refresh();
        return;
      }
      const nextBtn = e.target.closest('.js-next-btn');
      if (nextBtn && !nextBtn.disabled) {
        this.state.page++;
        this.refresh();
        return;
      }
    });
    
    // Confirm Dialog Close (Overlay/Cancel)
    if (this.confirmDialog) {
      this.confirmDialog.addEventListener('click', (e) => {
        if (e.target === this.confirmDialog || e.target.closest('.js-confirm-cancel')) {
          this.closeConfirm();
        }
      });
    }
  }

  async refresh() {
    // Show skeleton
    this.tbodyEl.innerHTML = buildSkeletonRows(5, this.options.columns.length);
    this.paginationContainerEl.innerHTML = '';

    const params = {
      page: this.state.page,
      per_page: this.state.perPage,
      ...(this.state.query ? { search: this.state.query } : {}),
      tab: this.state.tab // Pass tab if API needs it
    };

    const { items, meta, error } = await this.options.fetchData(params);

    if (error) {
      this.tbodyEl.innerHTML = buildEmptyRow(`Error loading data: ${error}`, this.options.columns.length);
      return;
    }

    if (!items || items.length === 0) {
      const emptyMsg = this.state.tab === 'trashed' ? 'No items in trash.' : 'No items found.';
      this.tbodyEl.innerHTML = buildEmptyRow(emptyMsg, this.options.columns.length);
    } else {
      this.tbodyEl.innerHTML = items.map(item => this.options.renderRow(item, this.state.tab)).join('');
    }

    if (meta) {
      this.paginationContainerEl.innerHTML = buildPaginationHTML(meta);
    }

    // Re-initialize Lucide icons if present
    if (window.lucide) window.lucide.createIcons();
  }

  /**
   * Dialog helper for confirmations (delete, force-delete, restore)
   */
  showConfirm(message, onConfirm) {
    if (!this.confirmDialog) return;
    
    this.confirmDialog.querySelector('.js-confirm-message').textContent = message;
    
    const okBtn = this.confirmDialog.querySelector('.js-confirm-ok');
    
    // Clear previous listeners
    const newOkBtn = okBtn.cloneNode(true);
    okBtn.replaceWith(newOkBtn);
    
    newOkBtn.addEventListener('click', async () => {
      newOkBtn.disabled = true;
      newOkBtn.textContent = 'Processing…';
      
      await onConfirm();
      
      newOkBtn.disabled = false;
      newOkBtn.textContent = 'Confirm';
      this.closeConfirm();
    });

    this.confirmDialog.classList.add('confirm-dialog--open');
  }

  closeConfirm() {
    if (this.confirmDialog) {
      this.confirmDialog.classList.remove('confirm-dialog--open');
    }
  }
}
