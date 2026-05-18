import { ReviewAPI } from "../api/review.api.js";

export function renderRating(rating) {
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

export async function generateProductCardsHTML(products) {
  const cardsHtml = await Promise.all(
    products.map(async (product) => {
      let validImage = product.primaryImage;
      if (
        !validImage ||
        !/\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(validImage)
      ) {
        validImage = "assets/images/default.png";
      }

      let parsedPrice = product.currentPrice || 0;

      let oldPrice = "";
      if (product.originalPrice > product.currentPrice) {
        oldPrice = `<span class="product-card__price--old">$${product.originalPrice}</span>`;
      }

      let discount = "";
      if (product.discountPercentage > 0) {
        discount = `<span class="product-card__price--discount">-${product.discountPercentage}%</span>`;
      }

      // Process load product and get avg review rating for product
      let reviews = [];
      try {
        reviews = await ReviewAPI.getByProduct(product.id);
      } catch (err) {
        console.error(`Failed to load reviews for product ${product.id}`);
      }

      let avgRating = 0; // fallback to product.rating if no reviews
      if (reviews && reviews.length > 0) {
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        const exactAvg = sum / reviews.length;
        // round to nearest 0.5
        avgRating = Math.round(exactAvg * 2) / 2;
      }

      let displayRating = avgRating % 1 === 0 ? avgRating + ".0" : avgRating;

      return `
		<div class="product-card" style="cursor: pointer;" onclick="window.location.href='product.html?id=${product.id}'">
			<figure class="product-card__image">
					<img src="${validImage}" alt="${product.name}" title="${product.name}" onerror="this.onerror=null; this.src='assets/images/default.png';">
				</figure>
				<div class="product-card__name-wrapper">
					<h3 class="product-card__name">${product.name}</h3>
					<h3 class="tooltip tooltip--product-card">${product.name}</h3>
				</div>
				<div class="product-card__rating">
					<div class="rating">${renderRating(avgRating)}</div>
          <p>${displayRating}<span>/5</span></p>
				</div>
				<div class="product-card__price">
					<span class="product-card__price--current">$${parsedPrice}</span>
					${oldPrice}
					${discount}
				</div>
			</div>
			`;
    }),
  );

  return cardsHtml.join("");
}
