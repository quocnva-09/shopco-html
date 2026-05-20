import { Modal } from '../components/modal.js';
import { DataTable } from '../components/table.js';
import { buildCategoryFormLayout, buildCategoryFormFooter } from '../layouts/category-form.layout.js';
import { buildCategoryRow, buildTrashedCategoryRow } from '../layouts/category-table.layout.js';
import { CategoryService } from '../../services/category.service.js';
import { showToast } from '../components/toast.js';
import { serializeForm, showErrors, clearErrors, resetFormState } from '../../utils/admin-form.util.js';

let categoryModal = null;
let dataTable = null;
let currentMode = 'create';
let currentCategoryId = null;

export function initCategoryModule(container) {
  if (!container) return;

  const formId = 'category-modal-form';
  const submitBtnId = 'modal-save-btn';
  const cancelBtnId = 'modal-cancel-btn';

  categoryModal = new Modal({
    id: 'category-modal',
    title: 'Create Category',
    bodyHTML: buildCategoryFormLayout(formId),
    footerHTML: buildCategoryFormFooter(formId, submitBtnId, cancelBtnId),
    onClose: resetFormState
  });

  const form = document.getElementById(formId);
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  dataTable = new DataTable(container, {
    columns: [
      { label: 'Category', className: '' },
      { label: 'Created At', className: '' },
      { label: 'Updated At', className: '' },
      { label: 'Actions', className: 'data-table__actions-col' }
    ],
    searchPlaceholder: 'Search categories...',
    actionBtnText: '+ Create Category',
    fetchData: async (params) => {
      let result;
      if (params.tab === 'trashed') {
        result = await CategoryService.getTrashedCategories(params);
      } else {
        result = await CategoryService.getAdminCategories(params);
      }
      return { items: result.categories, meta: result.meta, error: result.error };
    },
    renderRow: (category, tab) => {
      if (tab === 'trashed') return buildTrashedCategoryRow(category);
      return buildCategoryRow(category);
    },
    onAction: handleTableAction
  });
}

async function handleTableAction(action, dataset) {
  switch (action) {
    case 'create':
      currentMode = 'create';
      currentCategoryId = null;
      categoryModal.setTitle('Create Category');
      categoryModal.open();
      break;

    case 'edit':
      currentMode = 'edit';
      currentCategoryId = dataset.id;
      categoryModal.setTitle('Edit Category');

      const fillData = dataset || {};
      if (currentCategoryId && !dataset.name) {
        const { category, error } = await CategoryService.getAdminCategory(currentCategoryId);
        if (error) {
          showToast({ message: `Failed to load category: ${error}`, type: 'error' });
          return;
        }
        Object.assign(fillData, category);
      }
      fillForm(fillData);
      categoryModal.open();
      break;

    case 'delete':
      dataTable.showConfirm(`Move "${dataset.name}" to trash?`, async () => {
        const { error } = await CategoryService.deleteCategory(dataset.id);
        if (error) {
          showToast({ message: error, type: 'error' });
        } else {
          showToast({ message: 'Category moved to trash', type: 'success' });
          dataTable.refresh();
        }
      });
      break;

    case 'restore':
      dataTable.showConfirm(`Restore category "${dataset.name}"?`, async () => {
        const { error } = await CategoryService.restoreCategory(dataset.id);
        if (error) {
          showToast({ message: error, type: 'error' });
        } else {
          showToast({ message: 'Category restored successfully', type: 'success' });
          dataTable.refresh();
        }
      });
      break;

    case 'force-delete':
      dataTable.showConfirm(`Permanently delete "${dataset.name}"? This action cannot be undone.`, async () => {
        const { error } = await CategoryService.forceDeleteCategory(dataset.id);
        if (error) {
          showToast({ message: error, type: 'error' });
        } else {
          showToast({ message: 'Category permanently deleted', type: 'success' });
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
  const errors = validateForm(data);

  if (Object.keys(errors).length > 0) {
    showErrors(errors);
    return;
  }

  categoryModal.setLoading(true);

  let result;
  if (currentMode === 'create') {
    result = await CategoryService.createCategory(data);
  } else {
    const { name, slug, description } = data;
    result = await CategoryService.updateCategory(currentCategoryId, { name, slug, description });
  }

  categoryModal.setLoading(false, 'Saving…', currentMode === 'create' ? 'Submit' : 'Save Changes');

  if (result.error) {
    showToast({ message: result.error, type: 'error' });
    return;
  }

  showToast({ 
    message: currentMode === 'create' ? 'Category created successfully' : 'Category updated successfully', 
    type: 'success' 
  });
  
  categoryModal.close();
  dataTable.refresh();
}

function validateForm(data) {
  const errors = {};

  if (!data.name) {
    errors.name = 'Category name is required.';
  }

  if (!data.slug) {
    errors.slug = 'Slug is required.';
  } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
    errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens.';
  }

  return errors;
}

function fillForm(category) {
  const fieldMap = {
    name: category.name || '',
    slug: category.slug || '',
    description: category.description || ''
  };

  Object.entries(fieldMap).forEach(([name, value]) => {
    const el = document.querySelector(`[name="${name}"]`);
    if (el) el.value = value;
  });
}
