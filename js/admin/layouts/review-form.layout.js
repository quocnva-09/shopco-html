/**
 * Builds the form body HTML for viewing and updating a review's status.
 *
 * @param {string} formId - The form ID.
 * @returns {string} The HTML string.
 */
export function buildReviewFormLayout(formId) {
  return `
        <form class="admin-form js-admin-form" novalidate id="${formId}">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="admin-form__group">
                    <label class="admin-form__label">Review ID</label>
                    <input class="admin-form__input" type="text"
                        id="field-review-id" readonly
                        style="background-color: #f3f4f6;">
                </div>
                <div class="admin-form__group">
                    <label class="admin-form__label">Date</label>
                    <input class="admin-form__input" type="text"
                        id="field-review-date" readonly
                        style="background-color: #f3f4f6;">
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="admin-form__group">
                    <label class="admin-form__label">User Name</label>
                    <input class="admin-form__input" type="text"
                        id="field-review-user" readonly
                        style="background-color: #f3f4f6;">
                </div>
                <div class="admin-form__group">
                    <label class="admin-form__label">Product ID</label>
                    <input class="admin-form__input" type="text"
                        id="field-review-product" readonly
                        style="background-color: #f3f4f6;">
                </div>
            </div>

            <div class="admin-form__group">
                <label class="admin-form__label">Rating</label>
                <div id="field-review-rating" style="display:flex; gap:4px; align-items:center; padding-top: 4px;">
                    <!-- Stars injected here -->
                </div>
            </div>

            <div class="admin-form__group">
                <label class="admin-form__label">Comment</label>
                <textarea class="admin-form__input" id="field-review-comment" readonly
                    style="background-color: #f3f4f6; min-height: 80px; resize: none;"></textarea>
            </div>

            <div class="admin-form__group">
                <label class="admin-form__label" for="field-is-approved">
                    Status
                </label>
                <select class="admin-form__input" id="field-is-approved" name="isApproved">
                    <option value="false">Pending</option>
                    <option value="true">Approved</option>
                </select>
                <span class="admin-form__error js-field-error"
                    data-field="isApproved"></span>
            </div>
        </form>
    `;
}

/**
 * Builds the footer buttons for the review form modal.
 *
 * @param {string} formId - The form ID.
 * @param {string} submitBtnId - The save button ID.
 * @param {string} cancelBtnId - The cancel button ID.
 * @returns {string} The HTML string.
 */
export function buildReviewFormFooter(formId, submitBtnId, cancelBtnId) {
  return `
        <button class="admin-btn admin-btn--ghost js-modal-close"
            type="button" id="${cancelBtnId}">Close</button>
        <button class="admin-btn admin-btn--primary js-modal-submit"
            type="submit" form="${formId}" id="${submitBtnId}">
            Save Changes
        </button>
    `;
}
