import { ProductService } from "../services/product.service.js";
import SidebarFilter from "../components/sidebar-filter.js";
import { generateProductCardsHTML } from "../components/product-card.js";

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

export function initCategoryPage() {
  const productContainer = document.getElementById("js-category-products");
  if (!productContainer) return; // Only run if we are on the category page

  const sidebarFilterEl = document.querySelector('.js-sidebar-filter');
  if (sidebarFilterEl) {
    new SidebarFilter(sidebarFilterEl, (params) => {
      currentPage = 1;
      loadCategoryProducts(params);
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  const initialParams = Object.fromEntries(urlParams.entries());
  loadCategoryProducts(initialParams);

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
