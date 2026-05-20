export function serializeForm(form) {
  const data = {};
  const formData = new FormData(form);
  formData.forEach((value, key) => {
    data[key] = value.trim();
  });
  return data;
}

export function showErrors(errors) {
  clearErrors();
  Object.entries(errors).forEach(([field, message]) => {
    const input = document.querySelector(`[name="${field}"]`);
    const errorEl = document.querySelector(`.js-field-error[data-field="${field}"]`);
    if (input) input.classList.add('admin-form__input--error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('admin-form__error--visible');
    }
  });
}

export function clearErrors() {
  document.querySelectorAll('.js-field-error').forEach(el => {
    el.textContent = '';
    el.classList.remove('admin-form__error--visible');
  });
  document.querySelectorAll('.admin-form__input--error').forEach(el => {
    el.classList.remove('admin-form__input--error');
  });
}

export function resetFormState() {
  const form = document.querySelector('.js-admin-form');
  if (form) form.reset();
  clearErrors();
}