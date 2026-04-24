export function processMobileFilter() {
  const filterToggleBtn = document.querySelector(".js-mobile-filter-toggle");
  const sidebar = document.querySelector(".js-sidebar-filter");
  const overlay = document.querySelector(".js-overlay");
  // Assuming the close button has class js-close-filter
  const closeBtn = document.querySelector(".js-close-filter");

  if (!filterToggleBtn || !sidebar || !overlay) return;

  function openFilter() {
    sidebar.classList.add("sidebar--active");
    overlay.classList.add("js-overlay--active");
    // Prevent body scrolling when filter is open
    document.body.style.overflow = "hidden";
  }

  function closeFilter() {
    sidebar.classList.remove("sidebar--active");
    overlay.classList.remove("js-overlay--active");
    // Restore body scrolling
    document.body.style.overflow = "";
  }

  filterToggleBtn.addEventListener("click", openFilter);

  if (closeBtn) {
    closeBtn.addEventListener("click", closeFilter);
  }

  // Also close when clicking the overlay
  overlay.addEventListener("click", () => {
    // We check if sidebar is active to avoid interfering with mobile nav menu
    // The overlay is shared with the mobile nav. 
    if (sidebar.classList.contains("sidebar--active")) {
      closeFilter();
    }
  });
}
