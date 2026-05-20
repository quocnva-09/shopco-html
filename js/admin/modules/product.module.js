import { Modal } from '../components/modal.js';
import { DataTable } from '../components/table.js';
import { buildProductFormLayout, buildProductFormFooter } from '../layouts/product-form.layout.js';
import { buildProductRow, buildTrashedProductRow } from '../layouts/product-table.layout.js';
import { ProductService } from '../../services/product.service.js';
import { CategoryService } from '../../services/category.service.js';
import { showToast } from '../components/toast.js';
import { serializeForm, showErrors, clearErrors, resetFormState } from '../../utils/admin-form.util.js';

let productModal = null;
let dataTable = null;
let currentMode = 'create';
let currentProductId = null;

export function initProductModule(container) {
  if (!container) return;

  const formId = 'product-modal-form';
  const submitBtnId = 'modal-save-btn';
  const cancelBtnId = 'modal-cancel-btn';

  productModal = new Modal({
    id: 'product-modal',
    title: 'Create Product',
    bodyHTML: buildProductFormLayout(formId),
    footerHTML: buildProductFormFooter(formId, submitBtnId, cancelBtnId),
    onClose: resetFormState
  });

  const form = document.getElementById(formId);
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  // Preload categories for the form select
  loadCategoriesIntoSelect();

  dataTable = new DataTable(container, {
    columns: [
      { label: 'Product', className: '' },
      { label: 'Price', className: '' },
      { label: 'Category', className: '' },
      { label: 'Status', className: '' },
      { label: 'Actions', className: 'data-table__actions-col' }
    ],
    searchPlaceholder: 'Search products...',
    actionBtnText: '+ Create Product',
    fetchData: async (params) => {
      let result;
      if (params.tab === 'trashed') {
        result = await ProductService.getTrashedProducts(params);
      } else {
        result = await ProductService.getAdminProducts(params);
      }
      return { items: result.products, meta: result.meta, error: result.error };
    },
    renderRow: (product, tab) => {
      if (tab === 'trashed') return buildTrashedProductRow(product);
      return buildProductRow(product);
    },
    onAction: handleTableAction
  });
}

async function loadCategoriesIntoSelect() {
  const select = document.getElementById('field-category');
  if (!select) return;

  const { success, categories } = await CategoryService.getAdminCategories({ limit: 100 });
  if (success && categories) {
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = cat.name;
      select.appendChild(option);
    });
  }
}

async function handleTableAction(action, dataset) {
  switch (action) {
    case 'create':
      currentMode = 'create';
      currentProductId = null;
      productModal.setTitle('Create Product');
      productModal.open();
      break;

    case 'edit':
      currentMode = 'edit';
      currentProductId = dataset.id;
      productModal.setTitle('Edit Product');

      const fillData = dataset || {};
      if (currentProductId && !dataset.name) {
        try {
          const product = await ProductService.getProductById(currentProductId);
          Object.assign(fillData, product);
          fillData.category_id = product.category ? product.category.id : '';
        } catch (error) {
          showToast({ message: `Failed to load product: ${error.message}`, type: 'error' });
          return;
        }
      } else {
         // ensure boolean string conversion
         fillData.is_active = fillData.is_active === 'true' || fillData.is_active === true;
      }
      fillForm(fillData);
      productModal.open();
      break;

    case 'delete':
      dataTable.showConfirm(`Move "${dataset.name}" to trash?`, async () => {
        const { error } = await ProductService.deleteProduct(dataset.id);
        if (error) {
          showToast({ message: error, type: 'error' });
        } else {
          showToast({ message: 'Product moved to trash', type: 'success' });
          dataTable.refresh();
        }
      });
      break;

    case 'restore':
      dataTable.showConfirm(`Restore product "${dataset.name}"?`, async () => {
        const { error } = await ProductService.restoreProduct(dataset.id);
        if (error) {
          showToast({ message: error, type: 'error' });
        } else {
          showToast({ message: 'Product restored successfully', type: 'success' });
          dataTable.refresh();
        }
      });
      break;

    case 'force-delete':
      dataTable.showConfirm(`Permanently delete "${dataset.name}"? This action cannot be undone.`, async () => {
        const { error } = await ProductService.forceDeleteProduct(dataset.id);
        if (error) {
          showToast({ message: error, type: 'error' });
        } else {
          showToast({ message: 'Product permanently deleted', type: 'success' });
          dataTable.refresh();
        }
      });
      break;
  }
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const data = serializeForm(form);
  
  // Convert boolean fields
  data.is_active = !!form.elements['is_active'].checked;

  const errors = validateForm(data);

  if (Object.keys(errors).length > 0) {
    showErrors(errors);
    return;
  }

  productModal.setLoading(true);

  let result;
  if (currentMode === 'create') {
    result = await ProductService.createProduct(data);
  } else {
    result = await ProductService.updateProduct(currentProductId, data);
  }

  productModal.setLoading(false, 'Saving…', currentMode === 'create' ? 'Submit' : 'Save Changes');

  if (result.error) {
    showToast({ message: result.error, type: 'error' });
    return;
  }

  showToast({ 
    message: currentMode === 'create' ? 'Product created successfully' : 'Product updated successfully', 
    type: 'success' 
  });
  
  productModal.close();
  dataTable.refresh();
}

// Form Utilities

function validateForm(data) {
  const errors = {};

  if (!data.name) {
    errors.name = 'Product name is required.';
  }

  if (!data.slug) {
    errors.slug = 'Slug is required.';
  } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
    errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens.';
  }

  if (!data.price) {
    errors.price = 'Original price is required.';
  } else if (isNaN(data.price) || Number(data.price) < 0) {
    errors.price = 'Price must be a positive number.';
  }

  return errors;
}

function fillForm(product) {
  const fieldMap = {
    name: product.name || '',
    slug: product.slug || '',
    category_id: product.category_id || '',
    price: product.price || '',
    price_discount: product.price_discount || '',
    description: product.description || ''
  };

  Object.entries(fieldMap).forEach(([name, value]) => {
    const el = document.querySelector(`[name="${name}"]`);
    if (el) el.value = value;
  });

  const isActiveEl = document.querySelector('[name="is_active"]');
  if (isActiveEl) {
    isActiveEl.checked = product.is_active;
  }
}
