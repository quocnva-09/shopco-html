import { initHeader } from './components/header.js';
import { initFooter } from './components/footer.js';
import { initAuth } from './modules/auth.js';
import { initProfile } from './modules/profile.js';
import { initHomePage } from './modules/home.page.js';
import { initCategoryPage } from './modules/category.page.js';
import { initProductPage } from './modules/product-page.js';
import { initCartPage } from './modules/cart-page.js';
import { initOrderPage } from './modules/order.js';
import RangeSlider from './components/range-slider.js';
import SidebarFilter from './components/sidebar-filter.js';
import { processMobileFilter } from './components/filter.js';
import { initQuantitySelectors } from './components/quantity-selector.js';

document.addEventListener("DOMContentLoaded", () => {
  // Common components
  initHeader();
  initFooter();
  initQuantitySelectors();
  initAuth();
  initProfile();


  // Home Page logic
  initHomePage();

  // Product Page Specific logic
  initProductPage();

  // Cart Page Specific logic
  initCartPage();

  // Category Page Specific logic
  initCategoryPage();
  const rangeSliderEl = document.querySelector('.js-range-slider');
  if (rangeSliderEl) {
    new RangeSlider(rangeSliderEl);
  }

  const sidebarFilterEl = document.querySelector('.js-sidebar-filter');
  if (sidebarFilterEl) {
    new SidebarFilter(sidebarFilterEl);
  }

  processMobileFilter();

  // Order Page Specific logic
  initOrderPage();
});
