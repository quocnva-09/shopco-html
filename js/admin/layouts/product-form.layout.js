export function buildProductFormLayout(formId) {
  return `
    <form class="admin-form js-admin-form" novalidate id="${formId}">
      <div class="admin-form__group">
        <label class="admin-form__label" for="field-name">Product Name <span aria-hidden="true">*</span></label>
        <input class="admin-form__input" type="text" id="field-name" name="name" placeholder="e.g. T-Shirt" autocomplete="off">
        <span class="admin-form__error js-field-error" data-field="name"></span>
      </div>

      <div class="admin-form__group">
        <label class="admin-form__label" for="field-slug">Slug <span aria-hidden="true">*</span></label>
        <input class="admin-form__input" type="text" id="field-slug" name="slug" placeholder="e.g. t-shirt" autocomplete="off">
        <span class="admin-form__error js-field-error" data-field="slug"></span>
      </div>

      <div class="admin-form__group">
        <label class="admin-form__label" for="field-sizes">Sizes</label>
        <input class="admin-form__input" type="text" id="field-sizes" name="sizes" placeholder="e.g. S, M, L, XL" autocomplete="off">
      </div>

      <div class="admin-form__group">
        <label class="admin-form__label" for="field-colors">Colors</label>
        <input class="admin-form__input" type="text" id="field-colors" name="colors" placeholder="e.g. Red, Green, Blue" autocomplete="off">
      </div>

      <div class="admin-form__group">
        <label class="admin-form__label" for="field-category">Category</label>
        <select class="admin-form__input" id="field-category" name="category_id">
          <!-- Populated dynamically via JS -->
          <option value="">Select Category</option>
        </select>
        <span class="admin-form__error js-field-error" data-field="category_id"></span>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div class="admin-form__group">
          <label class="admin-form__label" for="field-original-price">Original Price</label>
          <input class="admin-form__input" type="number" id="field-original-price" name="price" placeholder="0" min="0">
          <span class="admin-form__error js-field-error" data-field="price"></span>
        </div>

        <div class="admin-form__group">
          <label class="admin-form__label" for="field-current-price">Discounted Price</label>
          <input class="admin-form__input" type="number" id="field-current-price" name="price_discount" placeholder="0" min="0">
          <span class="admin-form__error js-field-error" data-field="price_discount"></span>
        </div>
      </div>

      <div class="admin-form__group">
        <label class="admin-form__label" for="field-description">Description</label>
        <textarea class="admin-form__textarea" id="field-description" name="description" placeholder="Product description..." rows="3"></textarea>
      </div>

      <div class="admin-form__group">
        <label class="admin-form__label">Product Images</label>

        <div class="admin-form__input--image js-images-preview-container">
          <!-- Upload Trigger Card -->
          <div
            class="admin-form__image-trigger js-upload-trigger-card"
            onclick="document.getElementById('field-image-upload').click();"
          >
            <svg
              class="admin-form__image-trigger-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span class="admin-form__image-trigger-label">
              Add Image
            </span>
          </div>
        </div>

        <input
          type="file"
          id="field-image-upload"
          accept="image/*"
          multiple
          style="display: none;"
        >
        <input
          type="hidden"
          name="images"
          id="field-images-json"
          value="[]"
        >
        <span
          class="admin-form__error js-field-error"
          data-field="images"
        ></span>
      </div>

      <div class="admin-form__group" style="display: flex; align-items: center; gap: 8px;">
        <input type="checkbox" id="field-is-active" name="is_active" value="true" checked>
        <label class="admin-form__label" for="field-is-active" style="margin-bottom: 0;">Is Active</label>
      </div>
    </form>
  `;
}

export function buildProductFormFooter(formId, submitBtnId, cancelBtnId) {
  return `
    <button class="admin-btn admin-btn--ghost js-modal-close" type="button" id="${cancelBtnId}">Cancel</button>
    <button class="admin-btn admin-btn--primary js-modal-submit" type="submit" form="${formId}" id="${submitBtnId}">
      Submit
    </button>
  `;
}
