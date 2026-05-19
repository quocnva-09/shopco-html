// modules/auth.js
import { AuthService } from "../services/auth.service.js";

export function initAuth() {
  const authContainer = document.querySelector(".js-auth-container");
  if (!authContainer) return;

  const authTabs = document.querySelectorAll(".js-auth-tab");
  const authForm = document.querySelector(".js-auth-form");
  const submitBtn = document.querySelector(".js-auth-submit");
  const errorMessage = document.querySelector(".js-auth-error");

  const updateValidationForMode = (mode) => {
    const nameInput = document.getElementById("name");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const otpInput = document.getElementById("otp");

    if (mode === "register") {
      if (nameInput) nameInput.setAttribute("required", "required");
      if (passwordInput) passwordInput.setAttribute("required", "required");
      if (confirmPasswordInput) confirmPasswordInput.setAttribute("required", "required");
      if (otpInput) otpInput.removeAttribute("required");
    } else if (mode === "login") {
      if (nameInput) nameInput.removeAttribute("required");
      if (passwordInput) passwordInput.setAttribute("required", "required");
      if (confirmPasswordInput) confirmPasswordInput.removeAttribute("required");
      if (otpInput) otpInput.removeAttribute("required");
    } else if (mode === "forget") {
      if (nameInput) nameInput.removeAttribute("required");
      if (passwordInput) passwordInput.removeAttribute("required");
      if (confirmPasswordInput) confirmPasswordInput.removeAttribute("required");
      if (otpInput) otpInput.removeAttribute("required");
    } else if (mode === "otp") {
      if (nameInput) nameInput.removeAttribute("required");
      if (passwordInput) passwordInput.setAttribute("required", "required");
      if (confirmPasswordInput) confirmPasswordInput.setAttribute("required", "required");
      if (otpInput) otpInput.setAttribute("required", "required");
    }
  };

  // Khởi tạo trạng thái validation ban đầu
  updateValidationForMode(authContainer.dataset.mode || "login");

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
        updateValidationForMode(targetMode);
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
      const originalBtnHTML = submitBtn ? submitBtn.innerHTML : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Đang xử lý...";
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
        } else if (currentMode === "forget") {
          const result = await AuthService.requestResetOTP(email);
          if (result.success) {
            alert(result.message || "Mã OTP đã được gửi đến email của bạn.");
            authContainer.dataset.mode = "otp";
            updateValidationForMode("otp");
            const passwordInput = document.getElementById("password");
            if (passwordInput) passwordInput.value = "";
          }
        } else if (currentMode === "otp") {
          const otp = document.getElementById("otp") ? document.getElementById("otp").value.trim() : "";
          const newPassword = document.getElementById("password") ? document.getElementById("password").value.trim() : "";
          const confirmPassword = document.getElementById("confirm-password") ? document.getElementById("confirm-password").value.trim() : "";

          const result = await AuthService.verifyOTP(otp, newPassword, confirmPassword);
          if (result.success) {
            alert(result.message || "Đổi mật khẩu thành công!");
            authContainer.dataset.mode = "login";
            updateValidationForMode("login");
            document.querySelectorAll(`.auth__tab[data-target="login"]`).forEach((t) => {
              t.classList.add("auth__tab--active");
            });
            if (authForm) authForm.reset();
          }
        }
      } catch (error) {
        // Hiển thị lỗi ra UI
        if (errorMessage) errorMessage.textContent = error.message;
      } finally {
        // Tắt trạng thái loading
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        }
      }
    });
  }

  // 3. Xử lý Luồng Quên Mật Khẩu (Khởi tạo chuỗi OTP)
  const forgotPasswordBtn = document.querySelector(".js-forgot-password");
  if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener("click", (e) => {
      e.preventDefault();
      authContainer.dataset.mode = "forget";
      updateValidationForMode("forget");
      if (errorMessage) errorMessage.textContent = "";

      document.querySelectorAll(".auth__tab").forEach((t) => {
        t.classList.remove("auth__tab--active");
      });
    });
  }

  // 3. Xử lý hiển thị mật khẩu
  const togglePasswordBtns = document.querySelectorAll(".js-toggle-password");
  togglePasswordBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const wrapper = btn.closest(".form-input-wrapper");
      if (!wrapper) return;
      
      const input = wrapper.querySelector(".form-input");
      const iconEye = btn.querySelector(".icon-eye");
      const iconEyeOff = btn.querySelector(".icon-eye-off");

      if (!input) return;

      if (input.type === "password") {
        input.type = "text";
        if (iconEye) iconEye.style.display = "none";
        if (iconEyeOff) iconEyeOff.style.display = "block";
      } else {
        input.type = "password";
        if (iconEye) iconEye.style.display = "block";
        if (iconEyeOff) iconEyeOff.style.display = "none";
      }
    });
  });
}
