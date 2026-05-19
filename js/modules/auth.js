// modules/auth.js
import { AuthService } from "../services/auth.service.js";

const REQUIRED_FIELDS_MAP = {
  register: ["name", "password", "confirm-password"],
  login: ["password"],
  forget: [],
  otp: ["password", "confirm-password", "otp"]
};

const toggleRequiredAttr = (inputId, isRequired) => {
  const input = document.getElementById(inputId);
  if (!input) return;

  if (isRequired) {
    input.setAttribute("required", "required");
  } else {
    input.removeAttribute("required");
  }
};

// update mode required fields
const updateValidationForMode = (mode) => {
  const allFields = ["name", "password", "confirm-password", "otp"];
  const fieldsToRequire = REQUIRED_FIELDS_MAP[mode] || [];
  allFields.forEach(fieldId => {
    const isRequired = fieldsToRequire.includes(fieldId);
    toggleRequiredAttr(fieldId, isRequired);
  });
};

// change auth mode
const changeAuthMode = (targetMode, elements) => {
  const { container, form, errorMessage } = elements;

  container.dataset.mode = targetMode;
  if (errorMessage) errorMessage.textContent = "";

  document.querySelectorAll(".auth__tab").forEach((t) => {
    t.classList.toggle("auth__tab--active", t.dataset.target === targetMode);
  });

  if (form) form.reset();
  updateValidationForMode(targetMode);
};

// toggle password visibility
const togglePasswordVisibility = (btn) => {
  const wrapper = btn.closest(".form-input-wrapper");
  if (!wrapper) return;

  const input = wrapper.querySelector(".form-input");
  const iconEye = btn.querySelector(".icon-eye");
  const iconEyeOff = btn.querySelector(".icon-eye-off");

  if (!input) return;

  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";

  if (iconEye) iconEye.style.display = isPassword ? "none" : "block";
  if (iconEyeOff) iconEyeOff.style.display = isPassword ? "block" : "none";
};

// process login
const processLogin = async (email, password) => {
  const result = await AuthService.login(email, password);
  if (result.success) {
    alert("Login success!");
    window.location.href = result.redirectUrl;
  }
};

//process register
const processRegister = async (email, password) => {
  const name = document.getElementById("name")?.value.trim() || "";
  const phone = document.getElementById("phone")?.value.trim() || "";
  const confirmPassword = document.getElementById("confirm-password")?.value.trim() || "";

  if (password !== confirmPassword) {
    throw new Error("Confirm password does not match!");
  }

  const result = await AuthService.register({ name, email, phone, password, password_confirmation: confirmPassword });
  if (result.success) {
    alert("Register success!");
    window.location.href = result.redirectUrl;
  }
};

// process forget password
const processForgetPassword = async (email, elements) => {
  const result = await AuthService.requestResetOTP(email);
  if (result.success) {
    alert(result.message || "OTP has been sent to your email.");
    changeAuthMode("otp", elements); // Chuyển sang màn nhập OTP
  }
};

// process otp verification
const processOTPVerification = async (elements) => {
  const otp = document.getElementById("otp")?.value.trim() || "";
  const newPassword = document.getElementById("password")?.value.trim() || "";
  const confirmPassword = document.getElementById("confirm-password")?.value.trim() || "";

  const result = await AuthService.verifyOTP(otp, newPassword, confirmPassword);
  if (result.success) {
    alert(result.message || "Reset password success!");
    changeAuthMode("login", elements); // Trở về màn login
  }
};

// handle form submit
const handleFormSubmit = async (e, elements) => {
  e.preventDefault();
  const { container, submitBtn, errorMessage } = elements;

  if (errorMessage) errorMessage.textContent = "";

  const currentMode = container.dataset.mode || "login";
  const email = document.getElementById("email")?.value.trim() || "";
  const password = document.getElementById("password")?.value.trim() || "";

  // Bật trạng thái Loading
  const originalBtnHTML = submitBtn ? submitBtn.innerHTML : "";
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = "In progress...";
  }

  try {
    // Điều hướng xử lý dựa theo mode
    switch (currentMode) {
      case "login":
        await processLogin(email, password);
        break;
      case "register":
        await processRegister(email, password);
        break;
      case "forget":
        await processForgetPassword(email, elements);
        break;
      case "otp":
        await processOTPVerification(elements);
        break;
      default:
        throw new Error("Invalid authentication mode");
    }
  } catch (error) {
    if (errorMessage) errorMessage.textContent = error.message;
  } finally {
    // Tắt trạng thái Loading
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
    }
  }
};


export function initAuth() {
  const authContainer = document.querySelector(".js-auth-container");
  if (!authContainer) return;

  const elements = {
    container: authContainer,
    tabs: document.querySelectorAll(".js-auth-tab"),
    form: document.querySelector(".js-auth-form"),
    submitBtn: document.querySelector(".js-auth-submit"),
    errorMessage: document.querySelector(".js-auth-error"),
    forgotPasswordBtn: document.querySelector(".js-forgot-password"),
    togglePasswordBtns: document.querySelectorAll(".js-toggle-password")
  };

  changeAuthMode(authContainer.dataset.mode || "login", elements);

  elements.tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      if (tab.dataset.target) changeAuthMode(tab.dataset.target, elements);
    });
  });

  if (elements.form) {
    elements.form.addEventListener("submit", (e) => handleFormSubmit(e, elements));
  }

  if (elements.forgotPasswordBtn) {
    elements.forgotPasswordBtn.addEventListener("click", (e) => {
      e.preventDefault();
      changeAuthMode("forget", elements);
    });
  }

  elements.togglePasswordBtns.forEach((btn) => {
    btn.addEventListener("click", () => togglePasswordVisibility(btn));
  });
}
