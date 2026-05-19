/**
 * Redirect to login page if user is not authenticated
 *
 * @returns {void}
 */
export function authGuard() {
  const token = localStorage.getItem("access_token");
  if (!token) {
    window.location.href = "/auth.html";
  }
}
