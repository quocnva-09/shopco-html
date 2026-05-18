import { AuthService } from "../services/auth.service.js";

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

      const nameEl = document.querySelector(".user-card__name");
      const emailEl = document.querySelector(".user-card__email");
      const inputName = document.getElementById("profile-name");
      const inputEmail = document.getElementById("profile-email");

      if (nameEl) nameEl.textContent = user.name || "User";
      if (emailEl) emailEl.textContent = user.email || "";
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
}
