function processTabs() {
  const tabs = document.querySelectorAll(".tabs__item");
  const tabContents = document.querySelectorAll(".js-tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        t.classList.remove("tabs__item--active");
      });
      tab.classList.add("tabs__item--active");
      tabContents.forEach((tabContent) => {
        tabContent.style.display = "none";
      });
      const targetId = tab.getAttribute("data-tab");
      document.getElementById(targetId).style.display = "block";
    });
  });
}

function processFilter() {
  const filter = document.getElementById("js-btn-filter");
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

async function showReviews(filterRating = 0) {
  let reviews = await fetch("./assets/data/reviews.json").then((response) =>
    response.json(),
  );

  switch (filterRating) {
    case 4:
      reviews = reviews.filter((review) => Math.floor(review.rating) === 4);
      break;
    case 3:
      reviews = reviews.filter((review) => Math.floor(review.rating) === 3);
      break;
    case 2:
      reviews = reviews.filter((review) => Math.floor(review.rating) === 2);
      break;
    case 1:
      reviews = reviews.filter((review) => Math.floor(review.rating) === 1);
      break;
    default:
      break;
  }

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
          <div class="review-card__author">
            ${review.name}
            <span class="verified-icon"></span>
          </div>
          <p class="review-card__text">${review.comment}</p>
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
  let htmlContent = "";
  products.forEach((product) => {
    let oldPrice = product.oldPrice
      ? `<span class="product-card__price--old">$${product.oldPrice}</span>`
      : "";
    let discount = product.discount
      ? `<span class="product-card__price--discount">${product.discount}</span>`
      : "";

    htmlContent += `
			<div class="product-card">
				<figure class="product-card__image">
					<img src="${product.image}" alt="${product.name}">
				</figure>
				<h3 class="product-card__name">${product.name}</h3>
				<div class="product-card__rating">
					<div class="rating">${renderRating(product.rating)}</div>
          <p>${product.rating}<span>/5</span></p>
				</div>
				<div class="product-card__price">
					<span class="product-card__price--current">$${product.price}</span>
					${oldPrice}
					${discount}
				</div>
			</div>
			`;
  });
  productContainer.innerHTML = htmlContent;
}

function productSlider() {
  let currentIndex = 0;
  const MAX_INDEX = 4;
  const btnPrev = document.querySelector(".js-prev");
  const btnNext = document.querySelector(".js-next");

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
    const list = document.getElementById("js-related-products");
    const firstCard = list.querySelector(".product-card");

    const slideDistance = firstCard.offsetWidth + 20;

    list.style.transform = `translateX(-${currentIndex * slideDistance}px)`;
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      if (currentIndex < MAX_INDEX) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }
      updateSlider();
    }, 2000);
  }
  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  startAutoSlide();
}

document.addEventListener("DOMContentLoaded", () => {
  processTabs();
  processFilter();
  showReviews();
  showProducts();
  productSlider();
});
