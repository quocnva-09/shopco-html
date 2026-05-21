/**
 * Authentication & Authorization Guard
 * Runs on page load to verify user access rights.
 */
export function authGuard() {
  const currentPath = window.location.pathname;
  const token = localStorage.getItem("access_token");
  
  // Dùng try-catch để tránh lỗi sập app nếu JSON trong localStorage bị hỏng
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.error("Invalid user data in localStorage");
  }

  const isLoggedIn = !!(token && user);
  const isAdmin = isLoggedIn && user.role === "admin";

  // 1. NẾU CHƯA LOGIN
  if (!isLoggedIn) {
    // Chỉ redirect nếu hiện tại KHÔNG PHẢI là trang auth
    if (!currentPath.includes("/auth.html")) {
      window.location.replace("/auth.html"); // Dùng replace thay vì href để không rác lịch sử (Back button)
    }
    return;
  }

  // 2. NẾU ĐÃ LOGIN VÀ LÀ ADMIN
  if (isAdmin) {
    // Chỉ redirect nếu hiện tại KHÔNG PHẢI là trang admin
    if (!currentPath.includes("/admin-dashboard.html")) {
      window.location.replace("/admin-dashboard.html");
    }
    return;
  }

  // 3. NẾU ĐÃ LOGIN NHƯNG LÀ USER THƯỜNG
  // Ngăn chặn user thường quay lại trang login hoặc cố ý truy cập trang admin
  if (currentPath.includes("/auth.html") || currentPath.includes("/admin-dashboard.html")) {
    window.location.replace("/");
  }
}