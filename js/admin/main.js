import { initSidebar } from './components/sidebar.js';
import { initHeader } from './components/header.js';
import { initMetricsCards } from './components/metrics-card.js';
import { initOrderTags } from './components/order-tags.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Admin Components
  const sidebarContainer = document.querySelector('.js-admin-sidebar-container');
  const headerContainer = document.querySelector('.js-admin-header-container');
  const metricsContainer = document.querySelector('.js-admin-metrics-container');
  const orderTagsContainer = document.querySelector('.js-admin-ordertags-container');

  if (sidebarContainer) initSidebar(sidebarContainer);
  if (headerContainer) initHeader(headerContainer);
  if (metricsContainer) initMetricsCards(metricsContainer);
  if (orderTagsContainer) initOrderTags(orderTagsContainer);
});
