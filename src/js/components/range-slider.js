export default class RangeSlider {
  constructor(element) {
    this.container = element;
    this.track = this.container.querySelector('.js-range-track');
    this.thumbLeft = this.container.querySelector('.js-range-thumb-left');
    this.thumbRight = this.container.querySelector('.js-range-thumb-right');
    this.valuesContainer = this.container.querySelector('.js-range-values');
    
    // Config
    this.min = parseInt(this.container.dataset.min, 10) || 0;
    this.max = parseInt(this.container.dataset.max, 10) || 100;
    
    // State
    this.currentMin = parseInt(this.container.dataset.currentMin, 10) || this.min;
    this.currentMax = parseInt(this.container.dataset.currentMax, 10) || this.max;
    
    this.activeThumb = null;
    
    this.init();
  }

  init() {
    this.updateUI();
    this.bindEvents();
  }

  bindEvents() {
    // Prevent default drag for thumbs
    this.thumbLeft.addEventListener('dragstart', e => e.preventDefault());
    this.thumbRight.addEventListener('dragstart', e => e.preventDefault());

    // Pointer events for thumbs (supports mouse & touch)
    this.thumbLeft.addEventListener('pointerdown', (e) => this.handlePointerDown(e, 'left'));
    this.thumbRight.addEventListener('pointerdown', (e) => this.handlePointerDown(e, 'right'));

    // Global pointer events for moving and releasing
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
  }

  handlePointerDown(e, thumbType) {
    e.preventDefault();
    this.activeThumb = thumbType;
    
    // Add event listeners to document to capture movement outside the slider
    document.addEventListener('pointermove', this.handlePointerMove);
    document.addEventListener('pointerup', this.handlePointerUp);
    document.addEventListener('pointercancel', this.handlePointerUp);
  }

  handlePointerMove(e) {
    if (!this.activeThumb) return;

    const rect = this.container.getBoundingClientRect();
    let clientX = e.clientX;
    
    // Calculate percentage
    let percent = (clientX - rect.left) / rect.width;
    percent = Math.max(0, Math.min(1, percent));

    // Calculate value
    let value = Math.round(this.min + percent * (this.max - this.min));

    if (this.activeThumb === 'left') {
      value = Math.min(value, this.currentMax - 1); // Prevent crossing
      this.currentMin = value;
      this.thumbLeft.setAttribute('aria-valuenow', value);
    } else {
      value = Math.max(value, this.currentMin + 1); // Prevent crossing
      this.currentMax = value;
      this.thumbRight.setAttribute('aria-valuenow', value);
    }

    this.updateUI();
  }

  handlePointerUp() {
    if (this.activeThumb) {
      this.activeThumb = null;
      document.removeEventListener('pointermove', this.handlePointerMove);
      document.removeEventListener('pointerup', this.handlePointerUp);
      document.removeEventListener('pointercancel', this.handlePointerUp);
      
      // Update DOM data attributes
      this.container.dataset.currentMin = this.currentMin;
      this.container.dataset.currentMax = this.currentMax;

      // Dispatch custom event when user finishes dragging
      this.container.dispatchEvent(new CustomEvent('range-change', {
        detail: {
          min: this.currentMin,
          max: this.currentMax
        },
        bubbles: true
      }));
    }
  }

  updateUI() {
    const leftPercent = ((this.currentMin - this.min) / (this.max - this.min)) * 100;
    const rightPercent = ((this.currentMax - this.min) / (this.max - this.min)) * 100;

    // Delegate layout entirely to CSS variables
    this.container.style.setProperty('--slider-min', `${leftPercent}%`);
    this.container.style.setProperty('--slider-max', `${rightPercent}%`);

    // Update values text
    if (this.valuesContainer) {
      const spans = this.valuesContainer.querySelectorAll('span');
      if (spans.length >= 2) {
        spans[0].textContent = `$${this.currentMin}`;
        spans[1].textContent = `$${this.currentMax}`;
      }
    }
  }
  
  getValues() {
    return {
      min: this.currentMin,
      max: this.currentMax
    };
  }
}
