export function buildCategoryFormLayout(formId) {
  return `
    <form class="admin-form js-admin-form" novalidate id="${formId}">
      <div class="admin-form__group">
        <label class="admin-form__label" for="field-name">Category Name <span aria-hidden="true">*</span></label>
        <input class="admin-form__input" type="text" id="field-name" name="name" placeholder="e.g. Electronics" autocomplete="off">
        <span class="admin-form__error js-field-error" data-field="name"></span>
      </div>

      <div class="admin-form__group">
        <label class="admin-form__label" for="field-slug">Slug <span aria-hidden="true">*</span></label>
        <input class="admin-form__input" type="text" id="field-slug" name="slug" placeholder="e.g. electronics" autocomplete="off">
        <span class="admin-form__error js-field-error" data-field="slug"></span>
      </div>

      <div class="admin-form__group">
        <label class="admin-form__label" for="field-description">Description</label>
        <textarea class="admin-form__textarea" id="field-description" name="description" placeholder="Short description..." rows="3"></textarea>
      </div>
    </form>
  `;
}

export function buildCategoryFormFooter(formId, submitBtnId, cancelBtnId) {
  return `
    <button class="admin-btn admin-btn--ghost js-modal-close" type="button" id="${cancelBtnId}">Cancel</button>
    <button class="admin-btn admin-btn--primary js-modal-submit" type="submit" form="${formId}" id="${submitBtnId}">
      Submit
    </button>
  `;
}
