import { ENV } from "../config/env.js";

const BASE_URL = ENV.BASE_URL;
const API_CART = `${BASE_URL.replace(/\/$/, "")}/cart`;

const getHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong!");
  }
  return data;
};

export const CartAPI = {
  getCart: async () => {
    const response = await fetch(`${API_CART}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  add: async (payload) => {
    // payload should contain product_id, quantity, options
    const response = await fetch(`${API_CART}/add`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },

  updateItem: async (itemId, payload) => {
    // payload should contain quantity
    const response = await fetch(`${API_CART}/items/${itemId}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },

  removeItem: async (itemId) => {
    const response = await fetch(`${API_CART}/items/${itemId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  count: async () => {
    const response = await fetch(`${API_CART}/items/count`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  clear: async () => {
    const response = await fetch(`${API_CART}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};
