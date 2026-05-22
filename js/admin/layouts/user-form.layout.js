/**
 * User Form Layout
 * Returns the HTML for the user form content inside the modal.
 */
export function buildUserFormLayout(formId) {
  return `
    <form class="admin-form js-admin-form" novalidate id="${formId}">
      <div class="admin-form__row">
        <div class="admin-form__group">
          <label class="admin-form__label" for="field-name">Full Name <span aria-hidden="true">*</span></label>
          <input class="admin-form__input" type="text" id="field-name" name="name" placeholder="John Doe" autocomplete="off">
          <span class="admin-form__error js-field-error" data-field="name"></span>
        </div>
        <div class="admin-form__group">
          <label class="admin-form__label" for="field-email">Email <span aria-hidden="true">*</span></label>
          <input class="admin-form__input" type="email" id="field-email" name="email" placeholder="john@example.com" autocomplete="off">
          <span class="admin-form__error js-field-error" data-field="email"></span>
        </div>
      </div>

      <div class="admin-form__row js-password-row">
        <div class="admin-form__group">
          <label class="admin-form__label" for="field-password">Password <span aria-hidden="true">*</span></label>
          <input class="admin-form__input" type="password" id="field-password" name="password" placeholder="Min. 8 characters" autocomplete="new-password">
          <span class="admin-form__error js-field-error" data-field="password"></span>
        </div>
        <div class="admin-form__group">
          <label class="admin-form__label" for="field-role">Role</label>
          <select class="admin-form__select" id="field-role" name="role">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <span class="admin-form__error js-field-error" data-field="role"></span>
        </div>
      </div>

      <div class="admin-form__group">
        <label class="admin-form__label">Avatar</label>
        <div class="admin-form__input--image js-avatar-preview-container">
          <!-- Upload Trigger Card -->
          <div
            class="admin-form__image-trigger js-upload-trigger-card"
            onclick="document.getElementById('field-avatar-upload').click();"
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
              Add Avatar
            </span>
          </div>
        </div>
        <input
          type="file"
          id="field-avatar-upload"
          accept="image/*"
          style="display: none;"
        >
        <input
          type="hidden"
          name="avatar"
          id="field-avatar-json"
          value="[]"
        >
        <span class="admin-form__error js-field-error" data-field="avatar"></span>
      </div>

      <div class="admin-form__group">
        <label class="admin-form__label" for="field-phone">Phone</label>
        <input class="admin-form__input" type="tel" id="field-phone" name="phone" placeholder="+1 (555) 000-0000" autocomplete="off">
      </div>

      <div class="admin-form__group">
        <label class="admin-form__label" for="field-address">Address</label>
        <input class="admin-form__input" type="text" id="field-address" name="address" placeholder="123 Main St, City" autocomplete="off">
      </div>

      <div class="admin-form__group">
        <label class="admin-form__label" for="field-bio">Bio</label>
        <textarea class="admin-form__textarea" id="field-bio" name="bio" placeholder="Short bio..." rows="3"></textarea>
      </div>
    </form>
  `;
}

export function buildUserFormFooter(formId, submitBtnId, cancelBtnId) {
  return `
    <button class="admin-btn admin-btn--ghost js-modal-close" type="button" id="${cancelBtnId}">Cancel</button>
    <button class="admin-btn admin-btn--primary js-modal-submit" type="submit" form="${formId}" id="${submitBtnId}">
      Submit
    </button>
  `;
}
