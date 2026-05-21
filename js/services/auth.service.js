// services/auth.service.js
import { AuthAPI } from "../api/auth.api.js";
import { UserDTO } from "../models/user.dto.js";

export const AuthService = {
  login: async (email, password) => {
    if (!email.includes("@")) {
      throw new Error("Email không hợp lệ");
    }

    const rawData = await AuthAPI.login({ email, password });

    if (rawData.status !== 200) {
      throw new Error(rawData.message);
    }
    const data = rawData.data;
    let userName = "User";

    if (data && data.access_token) {
      localStorage.setItem("access_token", data.access_token);

      if (data.user) {
        const userDTO = new UserDTO(data.user);
        localStorage.setItem("user", JSON.stringify(userDTO));
        userName = userDTO.name;
      }
    }
    return {
      success: true,
      userName: userName,
      redirectUrl: data.user.role === "admin" ? "/admin/dashboard.html" : "/index.html",
    };
  },

  register: async (credentials) => {
    const rawData = await AuthAPI.register(credentials);

    if (rawData.status !== 200 && rawData.status !== 201) {
      throw new Error(rawData.message);
    }
    const data = rawData.data;
    let userName = "User";

    if (data && data.access_token) {
      localStorage.setItem("access_token", data.access_token);

      if (data.user) {
        const userDTO = new UserDTO(data.user);
        localStorage.setItem("user", JSON.stringify(userDTO));
        userName = userDTO.name;
      }
    }
    return {
      success: true,
      userName: userName,
      redirectUrl: "/index.html",
    };
  },

  logout: async () => {
    const res = await AuthAPI.logout();
    if (res.status !== 200) {
      throw new Error(res.message);
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    return {
      success: true,
      redirectUrl: "/login.html",
    };
  },

  requestResetOTP: async (email) => {
    if (!email.includes("@")) {
      throw new Error("Email không hợp lệ");
    }

    const rawData = await AuthAPI.requestResetOTP(email);

    if (rawData.status !== 200) {
      throw new Error(rawData.message);
    }

    // Save email temporarily for verify step
    localStorage.setItem("reset_email", email);

    return {
      success: true,
      message: rawData.message,
    };
  },

  verifyOTP: async (otp, newPassword, confirmPassword) => {
    const email = localStorage.getItem("reset_email");
    if (!email) {
      throw new Error("Không tìm thấy email, vui lòng yêu cầu lại mã OTP");
    }

    if (newPassword !== confirmPassword) {
      throw new Error("Mật khẩu xác nhận không khớp!");
    }

    const rawData = await AuthAPI.verifyOTP({
      otp,
      type: "forget",
      email,
      password: newPassword,
      password_confirmation: confirmPassword,
    });

    if (rawData.status !== 200) {
      throw new Error(rawData.message);
    }

    // Clear reset email upon success
    localStorage.removeItem("reset_email");

    return {
      success: true,
      message: rawData.message,
    };
  },
};
