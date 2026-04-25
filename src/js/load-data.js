// Render and load data functions
async function showReviews(filterRating = 0) {
  let reviews = await fetch("./assets/data/reviews.json").then((response) =>
    response.json(),
  );

  reviews =
    filterRating === 0
      ? reviews
      : reviews.filter((review) => Math.floor(review.rating) === filterRating);

  const reviewContainer = document.getElementById("js-reviews-grid");
  if (!reviewContainer) return;

  reviewContainer.innerHTML = "";
  reviews.forEach((review) => {
    reviewContainer.innerHTML += `
        <div class="review-card">
          <div class="review-card__header">
            <div class="rating-row">
                <div class="rating">${renderRating(review.rating)}</div>
            </div>
            <button class="review-card__menu"></button>
          </div>
          <div class="review-card__name-wrapper">
            <div class="review-card__name">
              <span>${review.name}</span>
              <span class="verified-icon"></span>
            </div>
            <div class="tooltip tooltip--review-card">
              <span>${review.name}</span>
              <span class="verified-icon"></span>
            </div>
          </div>
          <div class="review-card__comment-wrapper">
            <p class="review-card__comment">${review.comment}</p>
            <div class="tooltip tooltip--comment">${review.comment}</div>
          </div>
          <time class="review-card__date">Posted ${review.date}</time>
        </div>
        `;
  });
}

function renderRating(rating) {
  let stars = "";
  while (rating > 0) {
    if (rating >= 1) {
      stars += '<span class="rating__star"></span>';
      rating -= 1;
    } else {
      stars += '<span class="rating__star--half"></span>';
      rating -= 0.5;
    }
  }
  return stars;
}

let productsData = [];
let currentPage = 1;

function getItemsPerPage() {
  return window.innerWidth < 991 ? 6 : 9;
}

async function loadProducts() {
  productsData = await fetch("./assets/data/products.json").then((response) =>
    response.json(),
  );
  showCategoryProducts();
  showRelatedProducts();
}

function generateProductCardsHTML(products) {
  let htmlContent = "";
  products.forEach((product) => {
    let validImage = product.image[0];
    if (!validImage || !/\.(jpg|jpeg|png)$/i.test(validImage)) {
      validImage = "assets/images/default.png";
    }

    let parsedPrice = parseInt(product.price) || 0;

    let oldPrice = "";
    if (product.oldPrice) {
      let parsedOldPrice = parseInt(product.oldPrice);
      if (!isNaN(parsedOldPrice)) {
        oldPrice = `<span class="product-card__price--old">$${parsedOldPrice}</span>`;
      }
    }

    let discount = "";
    if (product.discount) {
      let parsedDiscount = parseInt(
        String(product.discount).replace(/[^\d.-]/g, ""),
      );
      if (!isNaN(parsedDiscount)) {
        let absDiscount = Math.abs(parsedDiscount);
        discount = `<span class="product-card__price--discount">-${absDiscount}%</span>`;
      }
    }

    htmlContent += `
			<div class="product-card">
				<figure class="product-card__image">
					<img src="${validImage}" alt="${product.name}" title="${product.name}" onerror="this.onerror=null; this.src='assets/images/default.png';">
				</figure>
				<div class="product-card__name-wrapper">
					<h3 class="product-card__name">${product.name}</h3>
					<h3 class="tooltip tooltip--product-card">${product.name}</h3>
				</div>
				<div class="product-card__rating">
					<div class="rating">${renderRating(product.rating)}</div>
          <p>${product.rating}<span>/5</span></p>
				</div>
				<div class="product-card__price">
					<span class="product-card__price--current">$${parsedPrice}</span>
					${oldPrice}
					${discount}
				</div>
			</div>
			`;
  });
  return htmlContent;
}

function showCategoryProducts() {
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

  productContainer.innerHTML = generateProductCardsHTML(paginatedProducts);
  renderPagination();
}

function showRelatedProducts() {
  const productContainer = document.getElementById("js-related-products");
  if (!productContainer) return;

  if (!productsData || productsData.length === 0) {
    productContainer.innerHTML =
      '<p class="product-empty-message" style="width: 100%; text-align: center;">No product to show!</p>';
    return;
  }

  // For related products, show only first 8
  const relatedProducts = productsData.slice(0, 8);
  productContainer.innerHTML = generateProductCardsHTML(relatedProducts);
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

document.addEventListener("DOMContentLoaded", () => {
  showReviews();
  loadProducts();
});
