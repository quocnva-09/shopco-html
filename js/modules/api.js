import { ProductService } from "../services/product.service.js";
import { ReviewService } from "../services/review.service.js";
import {
  generateProductCardsHTML,
  renderRating,
} from "../components/product-card.js";
import { generateReviewCardHTML } from "../components/review-card.js";

// Render and load data functions
async function showReviews(filterRating = 0) {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id") || 1;
  let reviews = await ReviewService.getByProduct(productId);

  reviews =
    filterRating === 0
      ? reviews
      : reviews.filter((review) => Math.floor(review.rating) === filterRating);

  const reviewContainer = document.getElementById("js-reviews-grid");
  if (!reviewContainer) return;

  reviewContainer.innerHTML = "";
  reviews.forEach((review) => {
    reviewContainer.innerHTML += generateReviewCardHTML(review);
  });
}

let productsData = [];
let currentPage = 1;

function getItemsPerPage() {
  return window.innerWidth < 991 ? 6 : 9;
}

async function loadProducts() {
  try {
    productsData = await ProductService.getAllProducts();
  } catch (error) {
    console.error("Failed to load products from API:", error);
    productsData = [];
  }
  showCategoryProducts();
  showProductCollection("js-new-arrivals", 4);
  showProductCollection("js-top-selling", 4);
  showProductCollection("js-related-products", 8);
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

  productContainer.innerHTML =
    await generateProductCardsHTML(paginatedProducts);
  renderPagination();
}

async function showProductCollection(selector, limit = 8) {
  const productContainer = document.getElementById(selector);
  if (!productContainer) return;

  if (!productsData || productsData.length === 0) {
    productContainer.innerHTML =
      '<p class="product-empty-message" style="width: 100%; text-align: center;">No product to show!</p>';
    return;
  }

  const products = productsData.slice(0, limit);
  productContainer.innerHTML = await generateProductCardsHTML(products);
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

let currentItemsPerPage = getItemsPerPage();
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

async function loadFeedbackSlider() {
  const feedbackContainer = document.querySelector(".js-feedback-items");
  if (!feedbackContainer) return;

  let reviews = [];
  try {
    reviews = await ReviewService.getAll();
  } catch (error) {
    console.error("Error loading reviews for feedback slider:", error);
    return;
  }

  // Lấy 8 thẻ đầu
  const topReviews = reviews.slice(0, 8);

  feedbackContainer.innerHTML = "";
  topReviews.forEach((review) => {
    feedbackContainer.innerHTML += generateReviewCardHTML(review);
  });

  // Setup slider scroll event
  const prevBtn = document.querySelector(".js-feedback-prev");
  const nextBtn = document.querySelector(".js-feedback-next");

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      const itemWidth =
        feedbackContainer.querySelector(".review-card")?.offsetWidth || 400;
      const gap =
        parseInt(window.getComputedStyle(feedbackContainer).gap) || 20;
      feedbackContainer.scrollBy({
        left: -(itemWidth + gap),
        behavior: "smooth",
      });
    });

    nextBtn.addEventListener("click", () => {
      const itemWidth =
        feedbackContainer.querySelector(".review-card")?.offsetWidth || 400;
      const gap =
        parseInt(window.getComputedStyle(feedbackContainer).gap) || 20;
      feedbackContainer.scrollBy({ left: itemWidth + gap, behavior: "smooth" });
    });
  }
}

export function initApiData() {
  showReviews();
  loadProducts();
  loadFeedbackSlider();
}
