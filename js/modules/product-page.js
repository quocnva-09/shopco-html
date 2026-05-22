import { ProductService } from "../services/product.service.js";
import { CartService } from "../services/cart.service.js";
import { ReviewService } from "../services/review.service.js";
import { generateReviewCardHTML } from "../components/review-card.js";
import { generateProductCardsHTML } from "../components/product-card.js";
import { formatPrice } from "../utils/format.js";
import { toast } from "../utils/toast.js";

// State to hold the current product ID
let currentProductId = null;

// product-gallery.js logic
function processGallery() {
  const mainImage = document.getElementById("js-main-image");
  const thumbnails = document.querySelectorAll(".product-detail__thumbnail");

  if (!mainImage || thumbnails.length === 0) return;

  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", function () {
      thumbnails.forEach((thumb) =>
        thumb.classList.remove("product-detail__thumbnail--active"),
      );
      this.classList.add("product-detail__thumbnail--active");
      mainImage.src = this.src;
      mainImage.alt = this.alt;
    });
  });
}

// product-info.js logic
function processProductInfo() {
  const quantityInput = document.querySelector(".js-qty-input");
  const addCartForm = document.getElementById("js-add-to-cart-form");

  if (addCartForm) {
    addCartForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!currentProductId) {
        toast.show("Product ID not found", "error");
        return;
      }

      const formData = new FormData(addCartForm);
      const selectedColor = formData.get("color");
      const selectedSize = formData.get("size");
      const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 1;

      try {
        const btnSubmit = addCartForm.querySelector('button[type="submit"]');
        if (btnSubmit) btnSubmit.disabled = true;

        await CartService.addItem(currentProductId, quantity, {
          colors: selectedColor,
          sizes: selectedSize,
        });

        toast.show(`Added ${quantity} item(s) to cart!`, "success");
      } catch (error) {
        toast.show(error.message || "Failed to add to cart", "error");
      } finally {
        const btnSubmit = addCartForm.querySelector('button[type="submit"]');
        if (btnSubmit) btnSubmit.disabled = false;
      }
    });
  }
}

// product-review.js logic
function processTabs() {
  const tabs = document.querySelectorAll(".tabs__item");
  const tabContents = document.querySelectorAll(".js-tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      switchTab(tab, tabs, tabContents);
    });
  });
}

function switchTab(selectedTab, allTabs, allContents) {
  allTabs.forEach((tab) => {
    tab.classList.remove("tabs__item--active");
    tab.setAttribute("aria-selected", "false");
  });

  selectedTab.classList.add("tabs__item--active");
  selectedTab.setAttribute("aria-selected", "true");

  allContents.forEach((content) => {
    content.classList.remove("tab-content--active");
  });

  const targetId = selectedTab.getAttribute("data-tab");
  const targetContent = document.getElementById(targetId);
  if (targetContent) {
    targetContent.classList.add("tab-content--active");
  }
}

function processFilter() {
  const filter = document.getElementById("js-btn-filter");
  if (!filter) return;
  const rating = [4, 3, 2, 1];
  const menu = filter.firstElementChild;
  menu.style.display = "none";

  if (menu.innerHTML === "") {
    rating.forEach((numRating) => {
      let stars = "";
      for (let i = 0; i < numRating; i++) {
        stars += '<span class="rating__star"></span>';
      }
      menu.innerHTML += `
            <div class="rating-row" data-rating="${numRating}">
                <div class="rating">${stars}</div>
            </div>
            `;
    });
  }

  const ratingRows = document.querySelectorAll(".rating-row");
  ratingRows.forEach((ratingRow) => {
    ratingRow.addEventListener("click", () => {
      const selectedRating = Number(ratingRow.getAttribute("data-rating"));
      showReviews(selectedRating);
      menu.style.display = "none";
    });
  });

  filter.addEventListener("click", () => {
    if (menu.style.display === "flex") {
      menu.style.display = "none";
    } else {
      menu.style.display = "flex";
    }
  });
}

// ── showReviews logic ───────────────────────────────────
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

async function initRelatedProducts(categoryId, currentId) {
  const list = document.getElementById("js-related-products");
  if (!list) return;

  try {
    const products = await ProductService.getAllProducts({ category_id: categoryId, limit: 8 });
    
    const relatedProducts = products
      .filter(p => String(p.id) !== String(currentId))
      .slice(0, 8);

    if (relatedProducts.length > 0) {
      list.innerHTML = await generateProductCardsHTML(relatedProducts);
      setupSlider(list, relatedProducts.length);
    } else {
      list.innerHTML = "<p>No related products found.</p>";
      const btnPrev = document.querySelector(".js-prev");
      const btnNext = document.querySelector(".js-next");
      if (btnPrev) btnPrev.style.display = "none";
      if (btnNext) btnNext.style.display = "none";
    }
  } catch (error) {
    console.error("Failed to load related products:", error);
  }
}

function setupSlider(list, itemCount) {
  let currentIndex = 0;
  const MAX_INDEX = Math.max(0, itemCount - 8);
  const btnPrev = document.querySelector(".js-prev");
  const btnNext = document.querySelector(".js-next");

  if (!btnPrev || !btnNext) return;

  if (MAX_INDEX === 0) {
    btnPrev.style.display = "none";
    btnNext.style.display = "none";
  } else {
    btnPrev.style.display = "";
    btnNext.style.display = "";
  }

  btnPrev.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
    }
    updateSlider();
  });

  btnNext.addEventListener("click", () => {
    if (currentIndex < MAX_INDEX) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    updateSlider();
  });

  function updateSlider() {
    const firstCard = list.querySelector(".product-card");
    if (!firstCard || !list) return;

    const slideDistance = firstCard.offsetWidth + 20;

    list.style.transform = `translateX(-${currentIndex * slideDistance}px)`;
  }

  let autoSlideInterval;
  function startAutoSlide() {
    if (MAX_INDEX === 0) return;
    autoSlideInterval = setInterval(() => {
      if (currentIndex < MAX_INDEX) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }
      updateSlider();
    }, 30000);
  }
  function stopAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
    }
  }

  startAutoSlide();
}

/**
 * Render product details dynamically
 * @param {import('../models/product.dto.js').ProductDTO} product
 */
function renderProduct(product) {
  // Main and Thumbnail Images
  const mainImage = document.getElementById("js-main-image");
  const thumbnailsContainer = document.querySelector(
    ".product-detail__thumbnails",
  );

  if (mainImage && product.primaryImage) {
    mainImage.src = product.primaryImage;
    mainImage.alt = product.name;
  }

  if (thumbnailsContainer && product.images.length > 0) {
    thumbnailsContainer.innerHTML = product.images
      .map(
        (img, idx) => `
        <img
          src="${img.img_path}"
          class="product-detail__thumbnail ${idx === 0 ? "product-detail__thumbnail--active" : ""}"
          alt="${product.name} - Thumbnail ${idx + 1}"
          title="${product.name} - Thumbnail ${idx + 1}"
        />
      `,
      )
      .join("");

    processGallery(); // Re-bind gallery events
  }

  // Text Information
  const titleEl = document.querySelector(".product-card__name");
  const descEl = document.querySelector(".product-detail__description");
  const priceCurrentEl = document.querySelector(
    ".product-card__price--current",
  );
  const priceOldEl = document.querySelector(".product-card__price--old");
  const priceDiscountEl = document.querySelector(
    ".product-card__price--discount",
  );
  const ratingTextEl = document.querySelector(".product-card__rating-text");

  if (titleEl) titleEl.textContent = product.name;
  if (descEl) descEl.textContent = product.description;
  if (priceCurrentEl)
    priceCurrentEl.textContent = formatPrice(product.currentPrice);

  if (priceOldEl) {
    if (product.discountPercentage > 0) {
      priceOldEl.textContent = formatPrice(product.originalPrice);
      priceOldEl.style.display = "inline";
    } else {
      priceOldEl.style.display = "none";
    }
  }

  if (priceDiscountEl) {
    if (product.discountPercentage > 0) {
      priceDiscountEl.textContent = `-${product.discountPercentage}%`;
      priceDiscountEl.style.display = "inline";
    } else {
      priceDiscountEl.style.display = "none";
    }
  }

  if (ratingTextEl) {
    ratingTextEl.innerHTML = `${product.rating}<span class="product-card__rating-text--muted">/5</span>`;
  }

  // Colors
  const colorSelector = document.querySelector(".color-selector");
  if (colorSelector && product.colors.length > 0) {
    colorSelector.innerHTML = product.colors
      .map(
        (color, idx) => `
        <input
          type="radio"
          name="color"
          id="color-${idx}"
          value="${color}"
          ${idx === 0 ? "checked" : ""}
          class="color-selector__input"
        />
        <label
          for="color-${idx}"
          class="color-selector__label"
          style="background-color: ${color}"
          title="${color}"
        ></label>
      `,
      )
      .join("");
  }

  // Sizes
  const sizeSelector = document.querySelector(".size-selector");
  if (sizeSelector && product.sizes.length > 0) {
    sizeSelector.innerHTML = product.sizes
      .map(
        (size, idx) => `
        <input
          type="radio"
          name="size"
          id="size-${idx}"
          value="${size}"
          ${idx === 0 ? "checked" : ""}
          class="size-selector__input"
        />
        <label for="size-${idx}" class="size-selector__label">${size}</label>
      `,
      )
      .join("");
  }
}

export async function initProductPage() {
  const productDetailSection = document.querySelector(".product-detail");
  if (!productDetailSection) return; // Not on the product page

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  let categoryId = null;

  if (id) {
    currentProductId = id;
    try {
      const rawProduct = await ProductService.getProductById(id);
      renderProduct(rawProduct.data);
      categoryId = rawProduct.data.category ? rawProduct.data.category.id : null;
    } catch (error) {
      console.error("Failed to load product details:", error);
      toast.show("Failed to load product details.", "error");
    }
  } else {
    // Optionally handle case where there is no ID in URL
    console.warn("No product ID found in URL");
  }

  processProductInfo();
  processTabs();
  processFilter();
  if (categoryId) {
    await initRelatedProducts(categoryId, currentProductId);
  }
  showReviews();
}
