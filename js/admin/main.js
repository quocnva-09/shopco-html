import { initSidebar } from './components/sidebar.js';
import { initHeader } from './components/header.js';
import { initMetricsCards } from './components/metrics-card.js';
import { initOrderTags } from './components/order-tags.js';
import { initUserModule } from './modules/user.module.js';
import { initCategoryModule } from './modules/category.module.js';
import { initProductModule } from './modules/product.module.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Admin Components
  const sidebarContainer = document.querySelector('.js-admin-sidebar-container');
  const headerContainer = document.querySelector('.js-admin-header-container');
  const metricsContainer = document.querySelector('.js-admin-metrics-container');
  const orderTagsContainer = document.querySelector('.js-admin-ordertags-container');
  const usersContainer = document.querySelector('.js-admin-users-container');
  const categoryContainer = document.querySelector('.js-admin-categories-container');
  const productContainer = document.querySelector('.js-admin-products-container');

  if (sidebarContainer) initSidebar(sidebarContainer);
  if (headerContainer) initHeader(headerContainer);
  if (metricsContainer) initMetricsCards(metricsContainer);
  if (orderTagsContainer) initOrderTags(orderTagsContainer);
  if (usersContainer) initUserModule(usersContainer);
  if (categoryContainer) initCategoryModule(categoryContainer);
  if (productContainer) initProductModule(productContainer);
});

