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
            <div class="review-card__name-full">
              <span>${review.name}</span>
              <span class="verified-icon"></span>
            </div>
          </div>
          <div class="review-card__comment-wrapper">
            <p class="review-card__comment">${review.comment}</p>
            <div class="review-card__comment-full">${review.comment}</div>
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

async function showProducts() {
  let products = await fetch("./assets/data/products.json").then((response) =>
    response.json(),
  );
  const productContainer = document.getElementById("js-related-products");

  if (!products || products.length === 0) {
    productContainer.innerHTML =
      '<p class="product-empty-message" style="width: 100%; text-align: center;">Hiện tại không có sản phẩm hiển thị</p>';
    return;
  }

  let htmlContent = "";
  products.forEach((product) => {
    let validImage = product.image;
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
					<img src="${validImage}" alt="${product.name}" onerror="this.onerror=null; this.src='assets/images/default.png';">
				</figure>
				<div class="product-card__name-wrapper">
					<h3 class="product-card__name">${product.name}</h3>
					<h3 class="product-card__name-full">${product.name}</h3>
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
  productContainer.innerHTML = htmlContent;
}

document.addEventListener("DOMContentLoaded", () => {
    showReviews();
    showProducts();
});
