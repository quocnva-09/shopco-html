export default class SidebarFilter {
  constructor(element) {
    this.container = element;
    this.applyButton = this.container.querySelector('.js-apply-filter');
    this.rangeSliderEl = this.container.querySelector('.js-range-slider');
    
    // Filter inputs
    this.categoryLinks = this.container.querySelectorAll('.filter-group--categories .filter-group__item a');
    this.colorInputs = this.container.querySelectorAll('input[name="color-filter"]');
    this.sizeInputs = this.container.querySelectorAll('input[name="size-filter"]');
    this.dressStyleLinks = this.container.querySelectorAll('.filter-group:last-of-type .filter-group__item a');
    
    // State
    this.filterState = {
      category: null,
      priceMin: null,
      priceMax: null,
      color: null,
      size: null,
      dressStyle: null
    };

    this.init();
  }

  init() {
    this.bindEvents();
    this.collectCurrentState(); // Initial state collection
  }

  bindEvents() {
    if (this.applyButton) {
      this.applyButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.collectCurrentState();
        this.submitFilter();
      });
    }

    // Capture category clicks (simulate selection for now)
    this.categoryLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.categoryLinks.forEach(l => l.style.fontWeight = 'normal');
        e.target.style.fontWeight = 'bold';
        this.filterState.category = e.target.textContent.trim();
      });
    });

    // Capture dress style clicks
    this.dressStyleLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.dressStyleLinks.forEach(l => l.style.fontWeight = 'normal');
        e.target.style.fontWeight = 'bold';
        this.filterState.dressStyle = e.target.textContent.trim();
      });
    });
    
    // Toggle accordions
    const toggles = this.container.querySelectorAll('.js-filter-toggle');
    toggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const group = toggle.closest('.filter-group');
        group.classList.toggle('filter-group--open');
        const content = group.querySelector('.filter-group__content');
        if (content) {
            // Basic toggle logic
            if (content.style.display === 'none') {
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
        }
      });
    });
  }

  collectCurrentState() {
    // Get colors
    const selectedColor = Array.from(this.colorInputs).find(input => input.checked);
    this.filterState.color = selectedColor ? selectedColor.value : null;

    // Get size
    const selectedSize = Array.from(this.sizeInputs).find(input => input.checked);
    this.filterState.size = selectedSize ? selectedSize.value : null;

    // Price from range slider data attributes
    if (this.rangeSliderEl) {
        const minStr = this.rangeSliderEl.dataset.currentMin;
        const maxStr = this.rangeSliderEl.dataset.currentMax;
        
        this.filterState.priceMin = minStr ? parseInt(minStr, 10) : null;
        this.filterState.priceMax = maxStr ? parseInt(maxStr, 10) : null;
    }
  }

  submitFilter() {
    console.log('--- Submitting Filter Payload ---');
    console.log(JSON.stringify(this.filterState, null, 2));
    alert('Filter payload generated! Please check the console log.');
    // Future integration: emit event or fetch API here
  }
}
