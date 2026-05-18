// modules/auth.js
import { AuthService } from "../services/auth.service.js";

export function initAuth() {
  const authContainer = document.querySelector(".js-auth-container");
  if (!authContainer) return;

  const authTabs = document.querySelectorAll(".js-auth-tab");
  const authForm = document.querySelector(".js-auth-form");
  const submitBtn = document.querySelector(".js-auth-submit");
  const errorMessage = document.querySelector(".js-auth-error");

  // 1. Xử lý chuyển đổi Tab (Giao diện)
  authTabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();

      const targetMode = tab.dataset.target;
      if (!targetMode) return;

      authContainer.dataset.mode = targetMode;

      if (errorMessage) errorMessage.textContent = "";

      document.querySelectorAll(".auth__tab").forEach((t) => {
        t.classList.remove("auth__tab--active");
      });

      document
        .querySelectorAll(`.auth__tab[data-target="${targetMode}"]`)
        .forEach((t) => {
          t.classList.add("auth__tab--active");
        });

      if (authForm) {
        authForm.reset();
        const nameInput = document.getElementById("name");
        const confirmPasswordInput =
          document.getElementById("confirm-password");

        if (targetMode === "register") {
          if (nameInput) nameInput.setAttribute("required", "required");
          if (confirmPasswordInput)
            confirmPasswordInput.setAttribute("required", "required");
          if (submitBtn) submitBtn.textContent = "Đăng ký";
        } else {
          if (nameInput) nameInput.removeAttribute("required");
          if (confirmPasswordInput)
            confirmPasswordInput.removeAttribute("required");
          if (submitBtn) submitBtn.textContent = "Đăng nhập";
        }
      }
    });
  });

  // 2. Xử lý Submit Form Xác thực (Email / Password)
  if (authForm) {
    authForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (errorMessage) errorMessage.textContent = "";

      const currentMode = authContainer.dataset.mode || "login";

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      // Hiển thị trạng thái loading
      const originalBtnText = submitBtn ? submitBtn.textContent : "Submit";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Đang xử lý...";
      }

      try {
        if (currentMode === "login") {
          // Gọi luồng Đăng nhập
          const result = await AuthService.login(email, password);
          if (result.success) {
            alert("Đăng nhập thành công!");
            window.location.href = result.redirectUrl;
          }
        } else if (currentMode === "register") {
          // Trích xuất thêm dữ liệu cho luồng Đăng ký
          const name = document.getElementById("name") ? document.getElementById("name").value.trim() : "";
          const phone = document.getElementById("phone") ? document.getElementById("phone").value.trim() : "";
          const confirmPassword = document.getElementById("confirm-password") ? document.getElementById("confirm-password").value.trim() : "";

          if (password !== confirmPassword) {
            throw new Error("Mật khẩu xác nhận không khớp!");
          }

          const result = await AuthService.register({
            name,
            email,
            phone,
            password,
            password_confirmation: confirmPassword,
          });
          if (result.success) {
            alert("Đăng ký thành công!");
            window.location.href = result.redirectUrl;
          }
        }
      } catch (error) {
        // Hiển thị lỗi ra UI
        if (errorMessage) errorMessage.textContent = error.message;
      } finally {
        // Tắt trạng thái loading
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });
  }

  // // 3. Xử lý Luồng Quên Mật Khẩu (Khởi tạo chuỗi OTP)
  // const forgotPasswordBtn = document.querySelector(".js-forgot-password");
  // if (forgotPasswordBtn) {
  //   forgotPasswordBtn.addEventListener("click", async (e) => {
  //     e.preventDefault();
  //     const email = document.getElementById("email").value.trim();

  //     if (!email) {
  //       if (errorMessage)
  //         errorMessage.textContent = "Vui lòng nhập email để nhận mã OTP.";
  //       return;
  //     }

  //     try {
  //       // Gọi Service để yêu cầu gửi mã OTP về email (Backend lưu cache tạm bằng Redis)
  //       await AuthService.requestResetOTP(email);

  //       // Mở modal hoặc chuyển UI sang form nhập mã OTP
  //       // showOTPModal(email);
  //       alert("Mã OTP đã được gửi đến email của bạn.");
  //     } catch (error) {
  //       if (errorMessage) errorMessage.textContent = error.message;
  //     }
  //   });
  // }
}
