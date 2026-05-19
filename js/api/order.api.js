import { ENV } from "../config/env.js";

const BASE_URL = ENV.BASE_URL;

export const OrderAPI = {
  getUserOrders: async (page = 1) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No access token found");
    }

    const response = await fetch(`${BASE_URL}/orders?page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    return response.json();
  },

  createOrder: async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No access token found");
    }

    const response = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      // create order based on current cart items stored in backend
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error("Failed to create order");
    }

    return response.json();
  },
};
