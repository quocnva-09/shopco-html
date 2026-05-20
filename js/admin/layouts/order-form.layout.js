/**
 * Builds the form body HTML for viewing and updating an order's status.
 *
 * @param {string} formId - The form ID.
 * @returns {string} The HTML string.
 */
export function buildOrderFormLayout(formId) {
    return `
        <form class="admin-form js-admin-form" novalidate id="${formId}">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="admin-form__group">
                    <label class="admin-form__label">Order ID</label>
                    <input class="admin-form__input" type="text"
                        id="field-order-id" readonly
                        style="background-color: #f3f4f6;">
                </div>
                <div class="admin-form__group">
                    <label class="admin-form__label">Total Amount ($)</label>
                    <input class="admin-form__input" type="text"
                        id="field-total-amount" readonly
                        style="background-color: #f3f4f6;">
                </div>
            </div>

            <div class="admin-form__group">
                <label class="admin-form__label">Order Items</label>
                <div id="field-order-items" style="
                    border: 1px solid #e5e7eb;
                    border-radius: 6px;
                    padding: 12px;
                    max-height: 180px;
                    overflow-y: auto;
                    background: #f9fafb;
                ">
                    <!-- Loaded dynamically in fillForm -->
                </div>
            </div>

            <div class="admin-form__group">
                <label class="admin-form__label" for="field-status">
                    Order Status
                </label>
                <select class="admin-form__input" id="field-status" name="status">
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <span class="admin-form__error js-field-error"
                    data-field="status"></span>
            </div>
        </form>
    `;
}

/**
 * Builds the footer buttons for the order form modal.
 *
 * @param {string} formId - The form ID.
 * @param {string} submitBtnId - The save button ID.
 * @param {string} cancelBtnId - The cancel button ID.
 * @returns {string} The HTML string.
 */
export function buildOrderFormFooter(formId, submitBtnId, cancelBtnId) {
    return `
        <button class="admin-btn admin-btn--ghost js-modal-close"
            type="button" id="${cancelBtnId}">Close</button>
        <button class="admin-btn admin-btn--primary js-modal-submit"
            type="submit" form="${formId}" id="${submitBtnId}">
            Save Changes
        </button>
    `;
}
