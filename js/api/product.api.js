import { ENV } from "../config/env.js";

const BASE_URL = ENV.BASE_URL;
const API_PRODUCTS = `${BASE_URL.replace(/\/$/, "")}/products/`;

export const ProductAPI = {
  getAll: async () => {
    const response = await fetch(API_PRODUCTS, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Lỗi kết nối đến server");
    }

    return data;
  },
};
