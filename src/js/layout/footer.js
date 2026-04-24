document.addEventListener("DOMContentLoaded", () => {
  const footer = document.querySelector(".footer");
  const footerHtml = `
      <div class="footer__newsletter">
        <div class="container">
          <div class="footer__newsletter-container">
            <h2 class="footer__newsletter-title">
              STAY UPTO DATE ABOUT OUR LATEST OFFERS
            </h2>
            <form class="footer__newsletter-form js-newsletter-form">
              <div class="footer__newsletter-input-wrapper">
                <input
                  type="email"
                  class="footer__newsletter-input"
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <button type="submit" class="btn btn--newsletter">
                Subscribe to Newsletter
              </button>
            </form>
          </div>
        </div>
      </div>
      <div class="footer__content">
        <div class="container">
          <div class="footer__main">
            <div class="footer__brand">
              <h2 class="footer__logo">SHOP.CO</h2>
              <p class="footer__desc">
                We have clothes that suits your style and which you're proud to
                wear. From women to men.
              </p>
              <div class="footer__socials">
                <a href="#" class="social-link" aria-label="Twitter">
                  <img
                    src="assets/icons/icn-logo-twitter.svg"
                    alt="Twitter logo"
                    title="Twitter logo"
                  />
                </a>
                <a href="#" class="social-link" aria-label="Facebook">
                  <img
                    src="assets/icons/icn-logo-fb.svg"
                    alt="Facebook logo"
                    title="Facebook logo"
                  />
                </a>
                <a href="#" class="social-link" aria-label="Instagram">
                  <img
                    src="assets/icons/icn-logo-insta.svg"
                    alt="Instagram logo"
                    title="Instagram logo"
                  />
                </a>
                <a href="#" class="social-link" aria-label="GitHub">
                  <img
                    src="assets/icons/icn-logo-github.svg"
                    alt="GitHub logo"
                    title="GitHub logo"
                  />
                </a>
              </div>
            </div>
            <div class="footer__links-group">
              <div class="footer__col">
                <h3 class="footer__col-title">COMPANY</h3>
                <ul class="footer__list">
                  <li class="footer__item">
                    <a href="#" class="footer__link">About</a>
                  </li>
                  <li class="footer__item">
                    <a href="#" class="footer__link">Features</a>
                  </li>
                  <li class="footer__item">
                    <a href="#" class="footer__link">Works</a>
                  </li>
                  <li class="footer__item">
                    <a href="#" class="footer__link">Career</a>
                  </li>
                </ul>
              </div>
              <div class="footer__col">
                <h3 class="footer__col-title">HELP</h3>
                <ul class="footer__list">
                  <li class="footer__item">
                    <a href="#" class="footer__link">Customer Support</a>
                  </li>
                  <li class="footer__item">
                    <a href="#" class="footer__link">Delivery Details</a>
                  </li>
                  <li class="footer__item">
                    <a href="#" class="footer__link">Terms & Conditions</a>
                  </li>
                  <li class="footer__item">
                    <a href="#" class="footer__link">Privacy Policy</a>
                  </li>
                </ul>
              </div>
              <div class="footer__col">
                <h3 class="footer__col-title">FAQ</h3>
                <ul class="footer__list">
                  <li class="footer__item">
                    <a href="#" class="footer__link">Account</a>
                  </li>
                  <li class="footer__item">
                    <a href="#" class="footer__link">Manage Deliveries</a>
                  </li>
                  <li class="footer__item">
                    <a href="#" class="footer__link">Orders</a>
                  </li>
                  <li class="footer__item">
                    <a href="#" class="footer__link">Payments</a>
                  </li>
                </ul>
              </div>
              <div class="footer__col">
                <h3 class="footer__col-title">RESOURCES</h3>
                <ul class="footer__list">
                  <li class="footer__item">
                    <a href="#" class="footer__link">Free eBooks</a>
                  </li>
                  <li class="footer__item">
                    <a href="#" class="footer__link">Development Tutorial</a>
                  </li>
                  <li class="footer__item">
                    <a href="#" class="footer__link">How to - Blog</a>
                  </li>
                  <li class="footer__item">
                    <a href="#" class="footer__link">Youtube Playlist</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="footer__bottom">
            <p class="footer__copyright">
              Shop.co © 2000-2026, All Rights Reserved
            </p>
            <ul class="footer__payments">
              <li class="payment-item">
                <img
                  src="assets/icons/icn-visa.svg"
                  alt="VISA payment"
                  title="VISA payment"
                />
              </li>
              <li class="payment-item">
                <img
                  src="assets/icons/icn-mastercard.svg"
                  alt="Mastercard payment"
                  title="Mastercard payment"
                />
              </li>
              <li class="payment-item">
                <img
                  src="assets/icons/icn-paypal.svg"
                  alt="Paypal payment"
                  title="Paypal payment"
                />
              </li>
              <li class="payment-item">
                <img
                  src="assets/icons/icn-a-pay.svg"
                  alt="Apple Pay payment"
                  title="Apple Pay payment"
                />
              </li>
              <li class="payment-item">
                <img
                  src="assets/icons/icn-g-pay.svg"
                  alt="Google Pay payment"
                  title="Google Pay payment"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
`;
  footer.innerHTML = footerHtml;
});
