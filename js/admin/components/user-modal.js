/**
 * User Modal Module
 *
 * Manages the Create / Edit user modal lifecycle.
 * The modal DOM is created once and reused for both modes.
 *
 * Public API:
 *  - initUserModal(onSave)     → call once on page load
 *  - openModal(mode, userData) → 'create' | 'edit'
 *  - closeModal()
 */

import { UserService } from '../../services/user.service.js';
import { showToast } from './user-toast.js';

// ─────────────────────────────────────────────────────────────
// State
// ─────────────────────────────────────────────────────────────
let modalEl = null;
let currentMode = 'create';
let currentUserId = null;
let onSaveCallback = null;

// ─────────────────────────────────────────────────────────────
// Modal HTML template
// ─────────────────────────────────────────────────────────────
function buildModalHTML() {
  return `
    <div class="user-modal js-user-modal" id="user-modal" role="dialog" aria-modal="true" aria-labelledby="user-modal-title">
      <div class="user-modal__panel">
        <div class="user-modal__header">
          <h2 class="user-modal__title" id="user-modal-title">Create User</h2>
          <button class="user-modal__close js-modal-close" type="button" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="user-modal__body">
          <form class="user-form js-user-form" novalidate id="user-modal-form">

            <div class="user-form__row">
              <div class="user-form__group">
                <label class="user-form__label" for="field-name">Full Name <span aria-hidden="true">*</span></label>
                <input class="user-form__input" type="text" id="field-name" name="name" placeholder="John Doe" autocomplete="off">
                <span class="user-form__error js-field-error" data-field="name"></span>
              </div>
              <div class="user-form__group">
                <label class="user-form__label" for="field-email">Email <span aria-hidden="true">*</span></label>
                <input class="user-form__input" type="email" id="field-email" name="email" placeholder="john@example.com" autocomplete="off">
                <span class="user-form__error js-field-error" data-field="email"></span>
              </div>
            </div>

            <div class="user-form__row js-password-row">
              <div class="user-form__group">
                <label class="user-form__label" for="field-password">Password <span aria-hidden="true">*</span></label>
                <input class="user-form__input" type="password" id="field-password" name="password" placeholder="Min. 8 characters" autocomplete="new-password">
                <span class="user-form__error js-field-error" data-field="password"></span>
              </div>
              <div class="user-form__group">
                <label class="user-form__label" for="field-role">Role</label>
                <select class="user-form__select" id="field-role" name="role">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <span class="user-form__error js-field-error" data-field="role"></span>
              </div>
            </div>

            <div class="user-form__group">
              <label class="user-form__label" for="field-phone">Phone</label>
              <input class="user-form__input" type="tel" id="field-phone" name="phone" placeholder="+1 (555) 000-0000" autocomplete="off">
            </div>

            <div class="user-form__group">
              <label class="user-form__label" for="field-address">Address</label>
              <input class="user-form__input" type="text" id="field-address" name="address" placeholder="123 Main St, City" autocomplete="off">
            </div>

            <div class="user-form__group">
              <label class="user-form__label" for="field-bio">Bio</label>
              <textarea class="user-form__textarea" id="field-bio" name="bio" placeholder="Short bio..." rows="3"></textarea>
            </div>

          </form>
        </div>

        <div class="user-modal__footer">
          <button class="admin-btn admin-btn--ghost js-modal-close" type="button" id="modal-cancel-btn">Cancel</button>
          <button class="admin-btn admin-btn--primary js-modal-submit" type="submit" form="user-modal-form" id="modal-save-btn">
            Create User
          </button>
        </div>
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────

/**
 * Initializes the modal once. Injects HTML into <body> and binds events.
 * Must be called before openModal().
 *
 * @param {function} onSave - Callback invoked after a successful create/update.
 */
export function initUserModal(onSave) {
  if (modalEl) return; // already initialized

  onSaveCallback = onSave;

  // Inject modal HTML
  const wrapper = document.createElement('div');
  wrapper.innerHTML = buildModalHTML();
  document.body.appendChild(wrapper.firstElementChild);
  modalEl = document.getElementById('user-modal');

  // Bind close triggers
  modalEl.querySelectorAll('.js-modal-close').forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  // Close on backdrop click
  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) closeModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalEl.classList.contains('user-modal--open')) {
      closeModal();
    }
  });

  // Form submit
  const form = modalEl.querySelector('.js-user-form');
  form.addEventListener('submit', handleSubmit);

  // Re-initialize Lucide icons if present
  if (window.lucide) window.lucide.createIcons();
}

/**
 * Opens the modal in create or edit mode.
 *
 * @param {'create' | 'edit'} mode
 * @param {Object|null} [userData=null] - Pre-fill data for edit mode.
 */
export async function openModal(mode, userData = null) {
  if (!modalEl) return;

  currentMode = mode;
  currentUserId = userData?.id ?? null;
  clearErrors();
  resetForm();

  const title = modalEl.querySelector('#user-modal-title');
  const submitBtn = modalEl.querySelector('.js-modal-submit');
  const passwordRow = modalEl.querySelector('.js-password-row');

  if (mode === 'create') {
    title.textContent = 'Create User';
    submitBtn.textContent = 'Create User';
    passwordRow.style.display = '';
  } else {
    title.textContent = 'Edit User';
    submitBtn.textContent = 'Save Changes';
    passwordRow.style.display = 'none'; // password not editable via this endpoint

    // Pre-fill form fields
    const fillData = userData || {};
    if (currentUserId && !userData) {
      // Fetch from API if only id was passed
      const { user, error } = await UserService.fetchUser(currentUserId);
      if (error) {
        showToast({ message: `Failed to load user: ${error}`, type: 'error' });
        return;
      }
      Object.assign(fillData, user);
    }
    fillForm(fillData);
  }

  modalEl.classList.add('user-modal--open');
  modalEl.querySelector('#field-name').focus();
}

/**
 * Closes the modal and resets its state.
 */
export function closeModal() {
  if (!modalEl) return;
  modalEl.classList.remove('user-modal--open');
  currentUserId = null;
  resetForm();
  clearErrors();
}

// ─────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────

/**
 * Handles form submission for both create and edit modes.
 *
 * @param {SubmitEvent} e
 */
async function handleSubmit(e) {
  e.preventDefault();

  const form = modalEl.querySelector('.js-user-form');
  const data = serializeForm(form);
  const errors = validateForm(data, currentMode);

  if (Object.keys(errors).length > 0) {
    showErrors(errors);
    return;
  }

  const submitBtn = modalEl.querySelector('.js-modal-submit');
  setLoading(submitBtn, true);

  let result;

  if (currentMode === 'create') {
    result = await UserService.addUser(data);
    result.error = result.error ?? null;
  } else {
    // Update only allows name, email, phone, bio, address
    const { name, email, phone, bio, address } = data;
    result = await UserService.editUser(currentUserId, { name, email, phone, bio, address });
  }

  setLoading(submitBtn, false);

  if (result.error) {
    showToast({ message: result.error, type: 'error' });
    return;
  }

  const successMessage = currentMode === 'create'
    ? 'User created successfully'
    : 'User updated successfully';

  showToast({ message: successMessage, type: 'success' });
  closeModal();

  if (typeof onSaveCallback === 'function') {
    onSaveCallback();
  }
}

/**
 * Serializes all named form inputs into a plain object.
 *
 * @param {HTMLFormElement} form
 * @returns {Object}
 */
function serializeForm(form) {
  const data = {};
  const formData = new FormData(form);
  formData.forEach((value, key) => {
    data[key] = value.trim();
  });
  return data;
}

/**
 * Validates form data. Returns an errors map { fieldName: message }.
 *
 * @param {Object} data
 * @param {'create'|'edit'} mode
 * @returns {Object}
 */
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

/**
 * Renders inline field errors.
 *
 * @param {Object} errors - { fieldName: message }
 */
function showErrors(errors) {
  clearErrors();
  Object.entries(errors).forEach(([field, message]) => {
    const input = modalEl.querySelector(`[name="${field}"]`);
    const errorEl = modalEl.querySelector(`.js-field-error[data-field="${field}"]`);
    if (input) input.classList.add('user-form__input--error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('user-form__error--visible');
    }
  });
}

/**
 * Clears all inline field errors.
 */
function clearErrors() {
  if (!modalEl) return;
  modalEl.querySelectorAll('.js-field-error').forEach(el => {
    el.textContent = '';
    el.classList.remove('user-form__error--visible');
  });
  modalEl.querySelectorAll('.user-form__input--error').forEach(el => {
    el.classList.remove('user-form__input--error');
  });
}

/**
 * Resets all form fields to empty.
 */
function resetForm() {
  if (!modalEl) return;
  const form = modalEl.querySelector('.js-user-form');
  if (form) form.reset();
}

/**
 * Pre-fills form fields with user data.
 *
 * @param {Object} user
 */
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
    const el = modalEl.querySelector(`[name="${name}"]`);
    if (el) el.value = value;
  });
}

/**
 * Toggles the loading state on the submit button.
 *
 * @param {HTMLElement} btn
 * @param {boolean} isLoading
 */
function setLoading(btn, isLoading) {
  btn.disabled = isLoading;
  btn.textContent = isLoading ? 'Saving…' : (currentMode === 'create' ? 'Create User' : 'Save Changes');
}
