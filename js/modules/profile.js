import { AuthService } from "../services/auth.service.js";
import { OrderService } from "../services/order.service.js";
import { generateOrderCardHTML } from "../components/order-card.js";

export function initProfile() {
  const profileContainer = document.querySelector(".profile__content");
  if (!profileContainer) return;

  const token = localStorage.getItem("access_token");
  if (!token) {
    window.location.href = "/auth.html";
    return;
  }

  const userString = localStorage.getItem("user");
  if (userString) {
    try {
      const user = JSON.parse(userString);

      const nameEl = document.querySelector(".js-user-name");
      const emailEl = document.querySelector(".js-user-email");
      const avatar = document.querySelector(".js-user-avatar");
      const dateEl = document.querySelector(".js-user-date");
      const inputName = document.getElementById("profile-name");
      const inputEmail = document.getElementById("profile-email");

      if (nameEl) nameEl.textContent = user.name || "User";
      if (emailEl) emailEl.textContent = user.email || "";
      if (avatar) avatar.src = user.avatar || "./assets/images/default.png";
      if (dateEl) {
        if (user.createdAt) {
          const year = new Date(user.createdAt).getFullYear();
          dateEl.textContent = `Member since ${year}`;
        } else {
          dateEl.textContent = "Member";
        }
      }
      if (inputName) inputName.value = user.name || "User";
      if (inputEmail) inputEmail.value = user.email || "";
    } catch (e) {
      console.error("Failed to parse user data from localStorage", e);
    }
  }

  const logoutBtn = document.querySelector(".btn--danger.btn--icon");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        const result = await AuthService.logout();
        if (result.success) {
          window.location.href = "/auth.html";
        }
      } catch (error) {
        console.error("Logout failed:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        window.location.href = "/auth.html";
      }
    });
  }

  initTabs();
}

function initTabs() {
  const tabButtons = document.querySelectorAll(".js-tabs-item");
  const tabContents = document.querySelectorAll(".js-tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => {
        btn.classList.remove("tabs__item--active");
        btn.setAttribute("aria-selected", "false");
      });
      tabContents.forEach((content) => {
        content.classList.remove("tab-content--active");
      });

      // Add active class to clicked button
      button.classList.add("tabs__item--active");
      button.setAttribute("aria-selected", "true");

      // Show corresponding content
      const targetId = button.getAttribute("data-tab");
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add("tab-content--active");

        // Load orders when the orders tab is active
        if (targetId === "tab-orders") {
          loadOrders();
        }
      }
    });
  });
}

async function loadOrders(page = 1) {
  const ordersListEl = document.getElementById("js-orders-list");
  if (!ordersListEl) return;

  ordersListEl.innerHTML =
    '<div class="loading-spinner">Loading orders...</div>';

  const result = await OrderService.getUserOrders(page);

  if (result.success) {
    if (result.orders.length === 0) {
      ordersListEl.innerHTML =
        '<div class="empty-state">You have no orders yet.</div>';
      return;
    }

    const ordersHTML = result.orders
      .map((order) => generateOrderCardHTML(order))
      .join("");
    ordersListEl.innerHTML = ordersHTML;
  } else {
    ordersListEl.innerHTML = `<div class="error-state">Failed to load orders: ${result.error}</div>`;
  }
}
