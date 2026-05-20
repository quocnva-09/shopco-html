import { buildModalLayout } from '../layouts/modal.layout.js';

/**
 * Generic Modal Component
 * Manages the DOM lifecycle, overlay, event bindings, and UI state for a modal.
 */
export class Modal {
  /**
   * Creates and initializes a modal instance.
   *
   * @param {Object} options
   * @param {string} options.id - Unique ID for the modal element.
   * @param {string} [options.title='Modal Title'] - Default title text.
   * @param {string} [options.bodyHTML=''] - Initial inner HTML for the modal body.
   * @param {string} [options.footerHTML=''] - Initial inner HTML for the modal footer.
   * @param {function} [options.onClose] - Callback fired when the modal closes.
   */
  constructor({ id, title = 'Modal Title', bodyHTML = '', footerHTML = '', onClose = null }) {
    this.id = id;
    this.titleId = `${id}-title`;
    this.onCloseCallback = onClose;

    // Inject modal shell into DOM
    this._injectDOM(title, bodyHTML, footerHTML);

    // Cache DOM refs
    this.modalEl = document.getElementById(this.id);
    this.titleEl = this.modalEl.querySelector('.modal__title');
    this.bodyEl = this.modalEl.querySelector('.js-modal-body');
    this.footerEl = this.modalEl.querySelector('.js-modal-footer');
    this.submitBtn = this.modalEl.querySelector('.js-modal-submit');

    // Bind events
    this._bindEvents();
  }

  _injectDOM(title, bodyHTML, footerHTML) {
    if (document.getElementById(this.id)) {
      document.getElementById(this.id).remove(); // Avoid duplicates if re-instantiated
    }
    const wrapper = document.createElement('div');
    wrapper.innerHTML = buildModalLayout(this.id, this.titleId, title);
    
    const bodyContainer = wrapper.querySelector('.js-modal-body');
    const footerContainer = wrapper.querySelector('.js-modal-footer');
    
    if (bodyContainer) bodyContainer.innerHTML = bodyHTML;
    if (footerContainer) footerContainer.innerHTML = footerHTML;

    document.body.appendChild(wrapper.firstElementChild);
  }

  _bindEvents() {
    // Close triggers (.js-modal-close)
    this.modalEl.querySelectorAll('.js-modal-close').forEach(btn => {
      btn.addEventListener('click', () => this.close());
    });

    // Close on overlay backdrop click
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) this.close();
    });

    // Close on Escape key (needs to be bound globally but bound to instance lifecycle)
    this._handleKeyDown = (e) => {
      if (e.key === 'Escape' && this.modalEl.classList.contains('modal--open')) {
        this.close();
      }
    };
    document.addEventListener('keydown', this._handleKeyDown);
  }

  /**
   * Opens the modal.
   */
  open() {
    this.modalEl.classList.add('modal--open');
    // Auto-focus first input if exists
    const firstInput = this.modalEl.querySelector('input:not([type="hidden"]), textarea, select');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 50);
    }
  }

  /**
   * Closes the modal.
   */
  close() {
    this.modalEl.classList.remove('modal--open');
    if (typeof this.onCloseCallback === 'function') {
      this.onCloseCallback();
    }
  }

  /**
   * Updates the modal title.
   * @param {string} text 
   */
  setTitle(text) {
    if (this.titleEl) this.titleEl.textContent = text;
  }

  /**
   * Toggles the loading state on the submit button.
   * @param {boolean} isLoading 
   * @param {string} [loadingText='Saving…']
   * @param {string} [defaultText='Submit']
   */
  setLoading(isLoading, loadingText = 'Saving…', defaultText = 'Submit') {
    if (this.submitBtn) {
      this.submitBtn.disabled = isLoading;
      this.submitBtn.textContent = isLoading ? loadingText : defaultText;
    }
  }

  /**
   * Fully destroys the modal from DOM and removes event listeners.
   */
  destroy() {
    document.removeEventListener('keydown', this._handleKeyDown);
    if (this.modalEl) this.modalEl.remove();
  }
}
