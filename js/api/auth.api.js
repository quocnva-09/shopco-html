import { ENV } from "../config/env.js";

const BASE_URL = ENV.BASE_URL;

export const AuthAPI = {
  login: async (credentials) => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Lỗi kết nối đến server");
    }
    return data;
  },

  register: async (credentials) => {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Lỗi kết nối đến server");
    }
    return data;
  },

  logout: async () => {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${BASE_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Lỗi kết nối đến server");
    }

    return data;
  },

  requestResetOTP: async (email) => {
    const response = await fetch(`${BASE_URL}/forget-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Lỗi kết nối đến server");
    }

    return data;
  },

  verifyOTP: async (payload) => {
    const response = await fetch(`${BASE_URL}/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Lỗi kết nối đến server");
    }

    return data;
  },
};
