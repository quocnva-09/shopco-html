import RangeSlider from './components/range-slider.js';
import SidebarFilter from './components/sidebar-filter.js';
import { processMobileFilter } from './components/filter.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Range Slider
  const rangeSliderEl = document.querySelector('.js-range-slider');
  if (rangeSliderEl) {
    new RangeSlider(rangeSliderEl);
  }

  // Initialize Sidebar Filter
  const sidebarFilterEl = document.querySelector('.js-sidebar-filter');
  if (sidebarFilterEl) {
    new SidebarFilter(sidebarFilterEl);
  }

  // Initialize Mobile Filter Toggle
  processMobileFilter();
});
