import { ENV } from "../config/env.js";
import { handleResponse } from "../utils/handleResponse.js";
import { getHeaders, getAuthHeaders } from "../utils/handleHeader.js";

const BASE_URL = ENV.BASE_URL;

export const AuthAPI = {
  /**
   * Log in user with credentials.
   * 
   * @param {{ email: string, password: string }} credentials - User credentials.
   * @returns {Promise<Object>} The authenticated user response.
   */
  async login(credentials) {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(credentials),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Login failed:", error);
      return { status: 500, message: error.message || "Lỗi kết nối đến server", data: null };
    }
  },

  /**
   * Register a new user account.
   * 
   * @param {Object} credentials - The registration data.
   * @returns {Promise<Object>} The registered user response.
   */
  async register(credentials) {
    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(credentials),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Registration failed:", error);
      return { status: 500, message: error.message || "Lỗi kết nối đến server", data: null };
    }
  },

  /**
   * Log out the currently authenticated user.
   * 
   * @returns {Promise<Object>} The logout response status.
   */
  async logout() {
    try {
      const response = await fetch(`${BASE_URL}/logout`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Logout failed:", error);
      return { status: 500, message: error.message || "Lỗi kết nối đến server", data: null };
    }
  },

  /**
   * Request password reset OTP code.
   * 
   * @param {string} email - The user's email address.
   * @returns {Promise<Object>} The request reset OTP response.
   */
  async requestResetOTP(email) {
    try {
      const response = await fetch(`${BASE_URL}/forget-password`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email }),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Request reset OTP failed:", error);
      return { status: 500, message: error.message || "Lỗi kết nối đến server", data: null };
    }
  },

  /**
   * Verify password reset OTP and update password.
   * 
   * @param {Object} payload - Verification payload (otp, email, password, password_confirmation, type).
   * @returns {Promise<Object>} The verification response.
   */
  async verifyOTP(payload) {
    try {
      const response = await fetch(`${BASE_URL}/verify-otp`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("OTP verification failed:", error);
      return { status: 500, message: error.message || "Lỗi kết nối đến server", data: null };
    }
  },
};
