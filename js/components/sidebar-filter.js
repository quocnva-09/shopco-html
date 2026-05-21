import { CategoryService } from "../services/category.service.js";

const COLORS = [
  { name: "green", hex: "#00c12b" },
  { name: "red", hex: "#f50606" },
  { name: "yellow", hex: "#f5dd06" },
  { name: "orange", hex: "#f57906" },
  { name: "cyan", hex: "#06caf5" },
  { name: "blue", hex: "#063af5", checked: true },
  { name: "purple", hex: "#7d06f5" },
  { name: "pink", hex: "#f506a4" },
  { name: "white", hex: "#ffffff", border: true },
  { name: "black", hex: "#000000" }
];

const SIZES = [
  { value: "XXS", label: "XX-Small" },
  { value: "XS", label: "X-Small" },
  { value: "S", label: "Small" },
  { value: "M", label: "Medium" },
  { value: "L", label: "Large", checked: true },
  { value: "XL", label: "X-Large" },
  { value: "XXL", label: "XX-Large" },
  { value: "3XL", label: "3X-Large" },
  { value: "4XL", label: "4X-Large" }
];

export default class SidebarFilter {
  constructor(element, onFilterChange) {
    this.container = element;
    this.onFilterChange = onFilterChange;
    this.applyButton = this.container.querySelector('.js-apply-filter');
    this.rangeSliderEl = this.container.querySelector('.js-range-slider');

    // State
    this.filterState = {
      category_id: null,
      min_price: null,
      max_price: null,
      colors: null,
      sizes: null,
      dressStyle: null,
      search: null
    };

    this.init();
  }

  async init() {
    await this.renderFilters();
    this.bindEvents();
    this.collectCurrentState(); // Initial state collection
  }

  async renderFilters() {
    // Render categories
    const categoriesContainer = this.container.querySelector(".js-categories-filter .filter-group__list");
    if (categoriesContainer) {
      try {
        const categoriesData = await CategoryService.getPublicCategories();
        const categories = categoriesData.categories || [];
        if (Array.isArray(categories)) {
          categoriesContainer.innerHTML = categories.map(cat => `
            <li class="filter-group__item">
              <a href="#" class="js-category-link" data-id="${cat.id}">${cat.name}</a>
              <img src="assets/icons/vector-direct-right.svg" alt="Right" />
            </li>
          `).join("");
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    }

    // Render colors
    const colorSelector = this.container.querySelector(".js-color-selector");
    if (colorSelector) {
      colorSelector.innerHTML = COLORS.map((color, idx) => `
        <input type="radio" name="color-filter" id="color-f${idx}" value="${color.name}" class="color-selector__input" ${color.checked ? 'checked' : ''} />
        <label for="color-f${idx}" class="color-selector__label" style="background-color: ${color.hex}; ${color.border ? 'border: 1px solid #ccc' : ''}"></label>
      `).join("");
    }

    // Render sizes
    const sizeSelector = this.container.querySelector(".js-size-selector");
    if (sizeSelector) {
      sizeSelector.innerHTML = SIZES.map((size, idx) => `
        <input type="radio" name="size-filter" id="size-f${idx}" value="${size.value}" class="size-selector__input" ${size.checked ? 'checked' : ''} />
        <label for="size-f${idx}" class="size-selector__label">${size.label}</label>
      `).join("");
    }
  }

  bindEvents() {
    if (this.applyButton) {
      this.applyButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.collectCurrentState();
        this.submitFilter();
      });
    }

    // Capture category clicks
    const categoryLinks = this.container.querySelectorAll('.js-category-link');
    categoryLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        // Toggle active state
        const isActive = link.classList.contains('active-category');
        categoryLinks.forEach(l => l.classList.remove('active-category', 'font-weight-bold'));
        
        let categoryId = null;
        if (!isActive) {
          link.classList.add('active-category', 'font-weight-bold');
          categoryId = link.getAttribute('data-id');
        }

        this.filterState.category_id = categoryId;
        
        // Submit instantly for categories
        this.collectCurrentState();
        this.submitFilter();
      });
    });

    // Capture dress style clicks
    const dressStyleLinks = this.container.querySelectorAll('.filter-group:last-of-type .filter-group__item a');
    dressStyleLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        dressStyleLinks.forEach(l => l.style.fontWeight = 'normal');
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
    const colorInputs = this.container.querySelectorAll('input[name="color-filter"]');
    const selectedColor = Array.from(colorInputs).find(input => input.checked);
    this.filterState.colors = selectedColor ? selectedColor.value : null;

    // Get size
    const sizeInputs = this.container.querySelectorAll('input[name="size-filter"]');
    const selectedSize = Array.from(sizeInputs).find(input => input.checked);
    this.filterState.sizes = selectedSize ? selectedSize.value : null;

    // Price from range slider data attributes
    if (this.rangeSliderEl) {
      const minStr = this.rangeSliderEl.getAttribute('data-current-min') || this.rangeSliderEl.getAttribute('data-min');
      const maxStr = this.rangeSliderEl.getAttribute('data-current-max') || this.rangeSliderEl.getAttribute('data-max');

      this.filterState.min_price = minStr ? parseInt(minStr, 10) : null;
      this.filterState.max_price = maxStr ? parseInt(maxStr, 10) : null;
    }

    // Search from URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchVal = urlParams.get('search');
    this.filterState.search = searchVal || null;
  }

  submitFilter() {
    console.log('--- Submitting Filter Payload ---');
    console.log(JSON.stringify(this.filterState, null, 2));
    
    if (this.onFilterChange) {
      this.onFilterChange(this.filterState);
    }
  }
}
