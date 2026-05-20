/**
 * Modal Layout
 * Returns the HTML structure for a generic modal.
 */
export function buildModalLayout(id, titleId, titleText) {
  return `
    <div class="modal js-modal" id="${id}" role="dialog" aria-modal="true" aria-labelledby="${titleId}">
      <div class="modal__panel">
        <div class="modal__header">
          <h2 class="modal__title" id="${titleId}">${titleText}</h2>
          <button class="modal__close js-modal-close" type="button" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal__body js-modal-body">
          <!-- Form or content will be injected here -->
        </div>

        <div class="modal__footer js-modal-footer">
          <!-- Action buttons will be injected here -->
        </div>
      </div>
    </div>
  `;
}
