import { Modal } from '../components/modal.js';
import { DataTable } from '../components/table.js';
import { buildAdminFormLayout, buildAdminFormFooter } from '../layouts/admin-form.layout.js';
import { buildUserRow, buildTrashedUserRow } from '../layouts/user-table.layout.js';
import { UserService } from '../../services/user.service.js';
import { showToast } from '../components/toast.js';
import { serializeForm, showErrors, clearErrors, resetFormState } from '../../utils/admin-form.util.js';

let userModal = null;
let dataTable = null;
let currentMode = 'create';
let currentUserId = null;

/**
 * Initializes the User Module.
 * Connects the generic DataTable with the User Modal and handles API orchestration.
 *
 * @param {HTMLElement} container - The container for the user table.
 */
export function initUserModule(container) {
  if (!container) return;

  // Initialize the generic Modal with User Form layouts
  const formId = 'user-modal-form';
  const submitBtnId = 'modal-save-btn';
  const cancelBtnId = 'modal-cancel-btn';

  userModal = new Modal({
    id: 'user-modal',
    title: 'Create User',
    bodyHTML: buildAdminFormLayout(formId),
    footerHTML: buildAdminFormFooter(formId, submitBtnId, cancelBtnId),
    onClose: resetFormState
  });

  // Bind form submission
  const form = document.getElementById(formId);
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  // Initialize the generic data table
  dataTable = new DataTable(container, {
    columns: [
      { label: 'User', className: '' },
      { label: 'Role', className: '' },
      { label: 'Phone', className: '' },
      { label: 'Joined', className: '' },
      { label: 'Actions', className: 'data-table__actions-col' }
    ],
    searchPlaceholder: 'Search by name or email…',
    actionBtnText: '+ Create User',
    fetchData: async (params) => {
      let result;
      if (params.tab === 'trashed') {
        result = await UserService.fetchTrashedUsers(params);
      } else {
        result = await UserService.fetchUsers(params);
      }
      return { items: result.users, meta: result.meta, error: result.error };
    },
    renderRow: (user, tab) => {
      if (tab === 'trashed') return buildTrashedUserRow(user);
      return buildUserRow(user);
    },
    onAction: handleTableAction
  });
}

// ─────────────────────────────────────────────────────────────
// Action Handlers
// ─────────────────────────────────────────────────────────────

async function handleTableAction(action, dataset) {
  switch (action) {
    case 'create':
      currentMode = 'create';
      currentUserId = null;
      userModal.setTitle('Create User');
      document.querySelector('.js-password-row').style.display = '';
      userModal.open();
      break;

    case 'edit':
      currentMode = 'edit';
      currentUserId = dataset.id;
      userModal.setTitle('Edit User');
      document.querySelector('.js-password-row').style.display = 'none';

      // Load form data
      const fillData = dataset || {};
      if (currentUserId && !dataset.name) {
        const { user, error } = await UserService.fetchUser(currentUserId);
        if (error) {
          showToast({ message: `Failed to load user: ${error}`, type: 'error' });
          return;
        }
        Object.assign(fillData, user);
      }
      fillForm(fillData);
      userModal.open();
      break;

    case 'delete':
      dataTable.showConfirm(`Move "${dataset.name}" to trash?`, async () => {
        const { error } = await UserService.trashUser(dataset.id);
        if (error) {
          showToast({ message: error, type: 'error' });
        } else {
          showToast({ message: 'User moved to trash', type: 'success' });
          dataTable.refresh();
        }
      });
      break;

    case 'restore':
      dataTable.showConfirm(`Restore user "${dataset.name}"?`, async () => {
        const { error } = await UserService.recoverUser(dataset.id);
        if (error) {
          showToast({ message: error, type: 'error' });
        } else {
          showToast({ message: 'User restored successfully', type: 'success' });
          dataTable.refresh();
        }
      });
      break;

    case 'force-delete':
      dataTable.showConfirm(`Permanently delete "${dataset.name}"? This action cannot be undone.`, async () => {
        const { error } = await UserService.destroyUser(dataset.id);
        if (error) {
          showToast({ message: error, type: 'error' });
        } else {
          showToast({ message: 'User permanently deleted', type: 'success' });
          dataTable.refresh();
        }
      });
      break;
  }
}

// ─────────────────────────────────────────────────────────────
// Form Submission & Validation
// ─────────────────────────────────────────────────────────────

async function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const data = serializeForm(form);
  const errors = validateForm(data, currentMode);

  if (Object.keys(errors).length > 0) {
    showErrors(errors);
    return;
  }

  userModal.setLoading(true);

  let result;
  if (currentMode === 'create') {
    result = await UserService.addUser(data);
    result.error = result.error ?? null;
  } else {
    // Update only allows specific fields
    const { name, email, phone, bio, address } = data;
    result = await UserService.editUser(currentUserId, { name, email, phone, bio, address });
  }

  userModal.setLoading(false, 'Saving…', currentMode === 'create' ? 'Submit' : 'Save Changes');

  if (result.error) {
    showToast({ message: result.error, type: 'error' });
    return;
  }

  showToast({ 
    message: currentMode === 'create' ? 'User created successfully' : 'User updated successfully', 
    type: 'success' 
  });
  
  userModal.close();
  dataTable.refresh();
}

// Utils

function validateForm(data, mode) {
  const errors = {};

  if (!data.name) {
    errors.name = 'Full name is required.';
  }

  if (!data.email) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (mode === 'create') {
    if (!data.password) {
      errors.password = 'Password is required.';
    } else if (data.password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }
  }

  return errors;
}

function fillForm(user) {
  const fieldMap = {
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
    bio: user.bio || '',
    role: user.role || 'user',
  };

  Object.entries(fieldMap).forEach(([name, value]) => {
    const el = document.querySelector(`[name="${name}"]`);
    if (el) el.value = value;
  });
}
