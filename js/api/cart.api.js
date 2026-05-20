import { ENV } from "../config/env.js";
import { handleResponse } from "../utils/handleResponse.js";
import { getAuthHeaders } from "../utils/handleHeader.js";

const BASE_URL = ENV.BASE_URL;
const API_CART = `${BASE_URL.replace(/\/$/, "")}/cart`;

export const CartAPI = {
  getCart: async () => {
    const response = await fetch(`${API_CART}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  add: async (payload) => {
    // payload should contain product_id, quantity, options
    const response = await fetch(`${API_CART}/add`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },

  updateItem: async (itemId, payload) => {
    // payload should contain quantity
    const response = await fetch(`${API_CART}/items/${itemId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },

  removeItem: async (itemId) => {
    const response = await fetch(`${API_CART}/items/${itemId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  count: async () => {
    const response = await fetch(`${API_CART}/items/count`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  clear: async () => {
    const response = await fetch(`${API_CART}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};
