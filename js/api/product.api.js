import { ENV } from "../config/env.js";
import { handleResponse } from "../utils/handleResponse.js";
import { getNoAcceptHeader, getAuthHeaders } from "../utils/handleHeader.js";

const BASE_URL = ENV.BASE_URL;
const API_PRODUCTS = `${BASE_URL.replace(/\/$/, "")}/products`;
const API_ADMIN_PRODUCTS = `${BASE_URL.replace(/\/$/, "")}/admin/products`;

export const ProductAPI = {
  /**
   * Fetch all products from backend.
   * 
   * @returns {Promise<Object>} The response data.
   */
  async getAll(queryString = "") {
    try {
      const response = await fetch(`${API_PRODUCTS}${queryString ? `?${queryString}` : ""}`, {
        method: "GET",
        headers: getNoAcceptHeader(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      return { status: 500, message: error.message || "Lỗi kết nối đến server", data: [] };
    }
  },

  /**
   * Fetch a single product by ID.
   * 
   * @param {number|string} id - The product ID.
   * @returns {Promise<Object>} The product details response.
   */
  async getById(id) {
    try {
      const response = await fetch(`${API_PRODUCTS}/${id}`, {
        method: "GET",
        headers: getNoAcceptHeader(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Failed to fetch product by ID ${id}:`, error);
      return { status: 500, message: error.message || "Failed to fetch product", data: null };
    }
  },

  // ---------------------------------------------------------------------------
  // ADMIN ENDPOINTS
  // ---------------------------------------------------------------------------

  async createProduct(data) {
    try {
      const response = await fetch(API_ADMIN_PRODUCTS, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Failed to create product:", error);
      return { status: 500, message: error.message || "Failed to create product", data: null };
    }
  },

  async updateProduct(id, data) {
    try {
      const response = await fetch(`${API_ADMIN_PRODUCTS}/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Failed to update product by ID ${id}:`, error);
      return { status: 500, message: error.message || "Failed to update product", data: null };
    }
  },

  async deleteProduct(id) {
    try {
      const response = await fetch(`${API_ADMIN_PRODUCTS}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Failed to delete product by ID ${id}:`, error);
      return { status: 500, message: error.message || "Failed to delete product", data: null };
    }
  },

  async getAdminProducts(queryString = "") {
    try {
      const response = await fetch(`${API_ADMIN_PRODUCTS}${queryString ? `?${queryString}` : ""}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Failed to fetch admin products:", error);
      return { status: 500, message: error.message || "Failed to fetch products", data: [] };
    }
  },

  async getTrashedProducts(queryString = "") {
    try {
      const response = await fetch(`${API_ADMIN_PRODUCTS}/trashed${queryString ? `?${queryString}` : ""}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Failed to fetch trashed products:", error);
      return { status: 500, message: error.message || "Failed to fetch trashed products", data: [] };
    }
  },

  async restoreProduct(id) {
    try {
      const response = await fetch(`${API_ADMIN_PRODUCTS}/${id}/restore`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Failed to restore product by ID ${id}:`, error);
      return { status: 500, message: error.message || "Failed to restore product", data: null };
    }
  },

  async forceDeleteProduct(id) {
    try {
      const response = await fetch(`${API_ADMIN_PRODUCTS}/${id}/force-delete`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Failed to force delete product by ID ${id}:`, error);
      return { status: 500, message: error.message || "Failed to force delete product", data: null };
    }
  },
};
