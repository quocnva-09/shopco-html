/**
 * Authentication & Authorization Guard
 * Runs on page load to verify user access rights.
 */
export function authGuard() {
  const currentPath = window.location.pathname;
  const token = localStorage.getItem("access_token");
  
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.error("Invalid user data in localStorage");
  }

  const isLoggedIn = !!(token && user);
  const isAdmin = isLoggedIn && user.role === "admin";

  if (!isLoggedIn) {
    if (!currentPath.includes("/auth.html")) {
      window.location.replace("/auth.html");
    }
    return;
  }

  if (currentPath.includes("/auth.html")) {
    if (isAdmin) {
      window.location.replace("/admin/dashboard.html");
    } else {
      window.location.replace("/index.html");
    }
    return;
  }

  if (!isAdmin && currentPath.includes("/admin")) {
    window.location.replace("/index.html");
    return;
  }
}