import { ENV } from "../config/env.js";
import { handleResponse } from "../utils/handleResponse.js";
import { getAuthHeaders } from "../utils/handleHeader.js";

const BASE_URL = ENV.BASE_URL;
const API_ORDERS = `${BASE_URL.replace(/\/$/, "")}/orders`;

export const OrderAPI = {
  /**
   * Fetch authenticated user's orders (paginated).
   * 
   * @param {string} [queryString=""]
   * @returns {Promise<Object>} The response data.
   */
  async getUserOrders(queryString = "") {
    try {
      const response = await fetch(`${API_ORDERS}${queryString ? `?${queryString}` : ""}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Failed to fetch user orders:", error);
      return { status: 500, message: error.message, data: [] };
    }
  },

  /**
   * Create a new order based on current cart items.
   * 
   * @returns {Promise<Object>} The created order response.
   */
  async createOrder() {
    try {
      const response = await fetch(API_ORDERS, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({}),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Failed to create order:", error);
      return { status: 500, message: error.message, data: null };
    }
  },

  /**
   * Fetch all orders (admin role paginated).
   * 
   * @param {string} [queryString=""]
   * @returns {Promise<Object>} The response data.
   */
  async getAllOrders(queryString = "") {
    try {
      const response = await fetch(`${API_ORDERS}${queryString ? `?${queryString}` : ""}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Failed to fetch all orders:", error);
      return { status: 500, message: error.message, data: [] };
    }
  },

  /**
   * Update the status of a specific order (admin).
   * 
   * @param {number|string} orderId - The ID of the order.
   * @param {string} status - The new status.
   * @returns {Promise<Object>} The updated order response.
   */
  async updateStatus(orderId, status) {
    try {
      const response = await fetch(`${API_ORDERS}/${orderId}/status`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Failed to update order status for ID ${orderId}:`, error);
      return { status: 500, message: error.message, data: null };
    }
  },

  /**
   * Fetch a specific order's details by ID.
   * 
   * @param {number|string} orderId - The ID of the order.
   * @returns {Promise<Object>} The order details response.
   */
  async getOrderById(orderId) {
    try {
      const response = await fetch(`${API_ORDERS}/${orderId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Failed to fetch order details for ID ${orderId}:`, error);
      return { status: 500, message: error.message, data: null };
    }
  },
};
