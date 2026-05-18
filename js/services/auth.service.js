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
      redirectUrl: "/index.html",
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
};
