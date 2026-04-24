document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const headerHtml = `<div class="top-bar">
        <div class="top-bar__container container">
          <p class="top-bar__text">
            Sign up and get 20% off to your first order.
            <a href="#" class="top-bar__link">Sign Up Now</a>
          </p>
          <button
            class="top-bar__close"
            aria-label="Close notification"
            id="js-close-top-bar"
          >
            <span>&#10005;</span>
          </button>
        </div>
      </div>

      <div class="container header__main">
        <button
          class="header__hamburger js-hamburger"
          aria-label="Menu"
        ></button>
        <a href="#" class="header__logo">SHOP.CO</a>

        <nav class="header__nav js-nav">
          <ul class="header__menu">
            <li class="header__menu-item">
              <a href="#" class="header__menu-link"
                >Shop
                <img
                  src="assets/icons/icn-arrow-down.svg"
                  alt=""
                  aria-hidden="true"
                  class="header__menu-icon"
              /></a>
            </li>
            <li class="header__menu-item">
              <a href="#" class="header__menu-link">On Sale</a>
            </li>
            <li class="header__menu-item">
              <a href="#" class="header__menu-link">New Arrivals</a>
            </li>
            <li class="header__menu-item">
              <a href="#" class="header__menu-link">Brands</a>
            </li>
          </ul>
        </nav>

        <div class="overlay js-overlay"></div>

        <div class="header__search">
          <form action="#" class="search-bar">
            <button type="submit" class="search-bar__btn" aria-label="Search">
              <img
                src="assets/icons/icn-look-up.svg"
                alt="Icon search"
                title="Icon search"
              />
            </button>
            <input
              type="text"
              class="search-bar__input"
              placeholder="Search for products..."
            />
          </form>
        </div>

        <div class="header__actions">
          <button class="icon-btn" aria-label="Cart">
            <img
              src="assets/icons/icn-cart.svg"
              alt="Icon cart"
              title="Icon cart"
            />
          </button>
          <button class="icon-btn" aria-label="User Profile">
            <img
              src="assets/icons/icn-user.svg"
              alt="Icon user"
              title="Icon user"
            />
          </button>
        </div>
      </div>
`;
  header.innerHTML = headerHtml;
});
