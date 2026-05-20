import { initUserTable, refreshUserTable } from '../components/user-table.js';
import { Modal } from '../components/modal.js';
import { buildUserFormLayout, buildUserFormFooter } from '../layouts/user-form.layout.js';
import { UserService } from '../../services/user.service.js';
import { showToast } from '../components/user-toast.js';

let userModal = null;
let currentMode = 'create';
let currentUserId = null;

/**
 * Initializes the User Module.
 * Connects the user table with the modal component and handles form submissions.
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
    bodyHTML: buildUserFormLayout(formId),
    footerHTML: buildUserFormFooter(formId, submitBtnId, cancelBtnId),
    onClose: resetFormState
  });

  // Bind form submission
  const form = document.getElementById(formId);
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  // Initialize the user table and pass modal trigger callbacks
  initUserTable(container, {
    onCreateUser: handleCreateUser,
    onEditUser: handleEditUser
  });
}

// ─────────────────────────────────────────────────────────────
// Modal Handlers
// ─────────────────────────────────────────────────────────────

function handleCreateUser() {
  currentMode = 'create';
  currentUserId = null;
  
  userModal.setTitle('Create User');
  document.querySelector('.js-password-row').style.display = '';
  
  userModal.open();
}

async function handleEditUser(userData) {
  currentMode = 'edit';
  currentUserId = userData.id;

  userModal.setTitle('Edit User');
  document.querySelector('.js-password-row').style.display = 'none';

  // Fetch full user data if needed, or just fill with dataset
  const fillData = userData || {};
  if (currentUserId && !userData) {
    const { user, error } = await UserService.fetchUser(currentUserId);
    if (error) {
      showToast({ message: `Failed to load user: ${error}`, type: 'error' });
      return;
    }
    Object.assign(fillData, user);
  }
  
  fillForm(fillData);
  userModal.open();
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
  refreshUserTable();
}

// ─────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────

function serializeForm(form) {
  const data = {};
  const formData = new FormData(form);
  formData.forEach((value, key) => {
    data[key] = value.trim();
  });
  return data;
}

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

function showErrors(errors) {
  clearErrors();
  Object.entries(errors).forEach(([field, message]) => {
    const input = document.querySelector(`[name="${field}"]`);
    const errorEl = document.querySelector(`.js-field-error[data-field="${field}"]`);
    if (input) input.classList.add('user-form__input--error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('user-form__error--visible');
    }
  });
}

function clearErrors() {
  document.querySelectorAll('.js-field-error').forEach(el => {
    el.textContent = '';
    el.classList.remove('user-form__error--visible');
  });
  document.querySelectorAll('.user-form__input--error').forEach(el => {
    el.classList.remove('user-form__input--error');
  });
}

function resetFormState() {
  const form = document.querySelector('.js-user-form');
  if (form) form.reset();
  clearErrors();
  currentUserId = null;
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
