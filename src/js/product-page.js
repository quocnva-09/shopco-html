// header.js
function processHeader() {
  const hamburger = document.querySelector(".js-hamburger");
  const nav = document.querySelector(".js-nav");
  const overlay = document.querySelector(".js-overlay");

  if (hamburger && nav && overlay) {
    hamburger.addEventListener("click", () => {
      nav.classList.toggle("js-nav--active");
      overlay.classList.toggle("js-overlay--active");
      hamburger.classList.toggle("header__hamburger--hidden");
    });

    overlay.addEventListener("click", () => {
      nav.classList.remove("js-nav--active");
      overlay.classList.remove("js-overlay--active");
      hamburger.classList.remove("header__hamburger--hidden");
    });
  }
}

// product-gallery.js
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

// product-info.js
function processProductInfo() {
  const quantityInput = document.querySelector(".js-qty-input");
  const decreaseBtn = document.querySelector(".js-qty-decrease");
  const increaseBtn = document.querySelector(".js-qty-increase");
  const addCartForm = document.getElementById("js-add-to-cart-form");

  if (quantityInput && decreaseBtn && increaseBtn) {
    decreaseBtn.addEventListener("click", () => {
      let currentValue = parseInt(quantityInput.value) || 1;
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    });

    increaseBtn.addEventListener("click", () => {
      let currentValue = parseInt(quantityInput.value) || 1;
      quantityInput.value = currentValue + 1;
    });

    quantityInput.addEventListener("change", () => {
      let currentValue = parseInt(quantityInput.value);
      if (isNaN(currentValue) || currentValue < 1) {
        quantityInput.value = 1;
      }
    });
  }

  if (addCartForm) {
    addCartForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(addCartForm);
      const selectedColor = formData.get("color");
      const selectedSize = formData.get("size");
      const quantity = quantityInput ? quantityInput.value : 1;

      console.log("Added to Cart:", {
        color: selectedColor,
        size: selectedSize,
        quantity: quantity,
      });

      alert(
        `Added ${quantity} item(s) to cart!\nColor: ${selectedColor}\nSize: ${selectedSize}`,
      );
    });
  }
}

// product-review.js
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
    content.style.display = "none";
  });

  const targetId = selectedTab.getAttribute("data-tab");
  const targetContent = document.getElementById(targetId);
  if (targetContent) {
    targetContent.style.display = "block";
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
      if (typeof showReviews === "function") {
        showReviews(selectedRating);
      }
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

function productSlider() {
  let currentIndex = 0;
  const MAX_INDEX = 4;
  const btnPrev = document.querySelector(".js-prev");
  const btnNext = document.querySelector(".js-next");

  if (!btnPrev || !btnNext) return;

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
    if (!firstCard) return;

    const slideDistance = firstCard.offsetWidth + 20;

    list.style.transform = `translateX(-${currentIndex * slideDistance}px)`;
  }

  let autoSlideInterval;
  function startAutoSlide() {
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
    clearInterval(autoSlideInterval);
  }

  startAutoSlide();
}

document.addEventListener("DOMContentLoaded", () => {
  processHeader();
  processGallery();
  processProductInfo();
  processTabs();
  processFilter();
  productSlider();
});
