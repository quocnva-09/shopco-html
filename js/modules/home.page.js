import { ProductService } from "../services/product.service.js";
import { ReviewService } from "../services/review.service.js";
import { generateProductCardsHTML } from "../components/product-card.js";
import { generateReviewCardHTML } from "../components/review-card.js";

async function loadProducts() {
  let productsData = [];
  try {
    productsData = await ProductService.getAllProducts();
  } catch (error) {
    console.error("Failed to load products from API:", error);
  }
  showProductCollection("js-new-arrivals", productsData, 4);
  showProductCollection("js-top-selling", productsData, 4);
}

async function showProductCollection(selector, productsData, limit = 8) {
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

async function loadFeedbackSlider() {
  const feedbackContainer = document.querySelector(".js-feedback-items");
  if (!feedbackContainer) return;

  let rawReview = [];
  let reviews = [];
  try {
    rawReview = await ReviewService.getAll();
    reviews = rawReview.reviews;
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

export function initHomePage() {
  loadProducts();
  loadFeedbackSlider();
}
