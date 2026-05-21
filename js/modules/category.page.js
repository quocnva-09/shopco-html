import { ProductService } from "../services/product.service.js";
import { CategoryService } from "../services/category.service.js";
import { generateProductCardsHTML } from "../components/product-card.js";

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

let productsData = [];
let currentPage = 1;
let currentItemsPerPage = getItemsPerPage();

function getItemsPerPage() {
  return window.innerWidth < 991 ? 6 : 9;
}

async function loadCategoryProducts(params = {}) {
  try {
    productsData = await ProductService.getAllProducts(params);
  } catch (error) {
    console.error("Failed to load products from API:", error);
    productsData = [];
  }
  showCategoryProducts();
}

async function showCategoryProducts() {
  const productContainer = document.getElementById("js-category-products");
  if (!productContainer) return;

  if (!productsData || productsData.length === 0) {
    productContainer.innerHTML =
      '<p class="product-empty-message" style="width: 100%; text-align: center;">No product to show!</p>';
    return;
  }

  const itemsPerPage = getItemsPerPage();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = productsData.slice(startIndex, endIndex);

  productContainer.innerHTML = await generateProductCardsHTML(paginatedProducts);
  renderPagination();
}

function renderPagination() {
  const paginationContainer = document.getElementById("js-pagination");
  if (!paginationContainer) return;

  const itemsPerPage = getItemsPerPage();
  const totalPages = Math.ceil(productsData.length / itemsPerPage);
  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
    return;
  }

  let html = "";

  // Prev button
  const prevDisabled = currentPage === 1 ? "pagination__btn--disabled" : "";
  html += `
    <button class="pagination__btn pagination__btn--prev ${prevDisabled}" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? "disabled" : ""}>
      <img
        src="assets/icons/icn-arrow-left.svg"
        alt="Prev"
        onerror="
          this.src = 'assets/icons/icn-arrow-down.svg';
          this.style.transform = 'rotate(90deg)';
        "
      />
      <span>Previous</span>
    </button>
    <div class="pagination__pages">
  `;

  // Page buttons
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      const activeClass = i === currentPage ? "pagination__page--active" : "";
      html += `<button class="pagination__page ${activeClass}" onclick="changePage(${i})">${i}</button>`;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      html += `<span class="pagination__dots">...</span>`;
    }
  }

  // Next button
  const nextDisabled =
    currentPage === totalPages ? "pagination__btn--disabled" : "";
  html += `
    </div>
    <button class="pagination__btn pagination__btn--next ${nextDisabled}" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? "disabled" : ""}>
      <span>Next</span>
      <img
        src="assets/icons/icn-arrow-right.svg"
        alt="Next"
        onerror="
          this.src = 'assets/icons/icn-arrow-down.svg';
          this.style.transform = 'rotate(-90deg)';
        "
      />
    </button>
  `;

  paginationContainer.innerHTML = html;
}

window.changePage = function (page) {
  const itemsPerPage = getItemsPerPage();
  const totalPages = Math.ceil(productsData.length / itemsPerPage);
  if (page < 1 || page > totalPages) return;

  currentPage = page;
  showCategoryProducts();

  // Scroll to top of product grid
  const productContainer = document.getElementById("js-category-products");
  if (productContainer) {
    productContainer.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

async function initFilters() {
  // Load categories
  const categoriesContainer = document.querySelector(".js-categories-filter .filter-group__list");
  if (categoriesContainer) {
    try {
      const categoriesData = await CategoryService.getPublicCategories();
      const categories = categoriesData.data || categoriesData;
      if (Array.isArray(categories)) {
        categoriesContainer.innerHTML = categories.map(cat => `
          <li class="filter-group__item">
            <a href="#" class="js-category-link" data-id="${cat.id}">${cat.name}</a>
            <img src="assets/icons/vector-direct-right.svg" alt="Right" />
          </li>
        `).join("");
        
        // Add click event for category links to select them
        const categoryLinks = categoriesContainer.querySelectorAll('.js-category-link');
        categoryLinks.forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            // Toggle active state
            const isActive = link.classList.contains('active-category');
            categoryLinks.forEach(l => l.classList.remove('active-category', 'font-weight-bold'));
            if (!isActive) {
              link.classList.add('active-category', 'font-weight-bold');
            }
          });
        });
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  }

  // Render colors
  const colorSelector = document.querySelector(".js-color-selector");
  if (colorSelector) {
    colorSelector.innerHTML = COLORS.map((color, idx) => `
      <input type="radio" name="color-filter" id="color-f${idx}" value="${color.name}" class="color-selector__input" ${color.checked ? 'checked' : ''} />
      <label for="color-f${idx}" class="color-selector__label" style="background-color: ${color.hex}; ${color.border ? 'border: 1px solid #ccc' : ''}"></label>
    `).join("");
  }

  // Render sizes
  const sizeSelector = document.querySelector(".js-size-selector");
  if (sizeSelector) {
    sizeSelector.innerHTML = SIZES.map((size, idx) => `
      <input type="radio" name="size-filter" id="size-f${idx}" value="${size.value}" class="size-selector__input" ${size.checked ? 'checked' : ''} />
      <label for="size-f${idx}" class="size-selector__label">${size.label}</label>
    `).join("");
  }

  // Handle Apply Filter
  const btnApply = document.querySelector(".js-apply-filter");
  if (btnApply) {
    btnApply.addEventListener("click", () => {
      const params = {};

      // Category
      const activeCategory = document.querySelector('.js-category-link.active-category');
      if (activeCategory) {
        params.category_id = activeCategory.getAttribute('data-id');
      }

      // Range Slider
      const rangeSlider = document.querySelector(".js-range-slider");
      if (rangeSlider) {
        params.minPrice = rangeSlider.getAttribute("data-current-min") || rangeSlider.getAttribute("data-min");
        params.maxPrice = rangeSlider.getAttribute("data-current-max") || rangeSlider.getAttribute("data-max");
      }

      // Color
      const selectedColor = document.querySelector('input[name="color-filter"]:checked');
      if (selectedColor) {
        params.color = selectedColor.value;
      }

      // Size
      const selectedSize = document.querySelector('input[name="size-filter"]:checked');
      if (selectedSize) {
        params.size = selectedSize.value;
      }

      // Reset page and reload
      currentPage = 1;
      loadCategoryProducts(params);
    });
  }
}

export function initCategoryPage() {
  const productContainer = document.getElementById("js-category-products");
  if (!productContainer) return; // Only run if we are on the category page

  initFilters();
  loadCategoryProducts();

  window.addEventListener("resize", () => {
    if (!document.getElementById("js-category-products")) return;
  
    const newItemsPerPage = getItemsPerPage();
    if (currentItemsPerPage !== newItemsPerPage) {
      currentItemsPerPage = newItemsPerPage;
      const totalPages = Math.ceil(productsData.length / newItemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
      } else if (currentPage === 0 && totalPages > 0) {
        currentPage = 1;
      }
      showCategoryProducts();
    }
  });
}
