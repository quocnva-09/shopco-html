import { ENV } from "../config/env.js";
import { handleResponse } from "../utils/handleResponse.js";
import { getAuthHeaders, getNoAcceptHeader } from "../utils/handleHeader.js";

const BASE_URL = ENV.BASE_URL;
const API_CATEGORIES = `${BASE_URL.replace(/\/$/, "")}/categories`;
const API_ADMIN_CATEGORIES = `${BASE_URL.replace(/\/$/, "")}/admin/categories`;

export const CategoryAPI = {
  // ---------------------------------------------------------------------------
  // PUBLIC ENDPOINTS
  // ---------------------------------------------------------------------------

  async getPublicCategories(queryString = "") {
    try {
      const response = await fetch(`${API_CATEGORIES}${queryString ? `?${queryString}` : ""}`, {
        method: "GET",
        headers: getNoAcceptHeader(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Failed to fetch public categories:", error);
      return { status: 500, message: error.message || "Failed to fetch categories", data: [] };
    }
  },

  async getPublicCategory(id) {
    try {
      const response = await fetch(`${API_CATEGORIES}/${id}`, {
        method: "GET",
        headers: getNoAcceptHeader(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Failed to fetch public category by ID ${id}:`, error);
      return { status: 500, message: error.message || "Failed to fetch category", data: null };
    }
  },

  // ---------------------------------------------------------------------------
  // ADMIN ENDPOINTS
  // ---------------------------------------------------------------------------

  async createCategory(data) {
    try {
      const response = await fetch(API_ADMIN_CATEGORIES, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Failed to create category:", error);
      return { status: 500, message: error.message || "Failed to create category", data: null };
    }
  },

  async updateCategory(id, data) {
    try {
      const response = await fetch(`${API_ADMIN_CATEGORIES}/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Failed to update category by ID ${id}:`, error);
      return { status: 500, message: error.message || "Failed to update category", data: null };
    }
  },

  async deleteCategory(id) {
    try {
      const response = await fetch(`${API_ADMIN_CATEGORIES}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Failed to delete category by ID ${id}:`, error);
      return { status: 500, message: error.message || "Failed to delete category", data: null };
    }
  },

  async getAdminCategory(id) {
    try {
      const response = await fetch(`${API_ADMIN_CATEGORIES}/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Failed to fetch admin category by ID ${id}:`, error);
      return { status: 500, message: error.message || "Failed to fetch category", data: null };
    }
  },

  async getAdminCategories(queryString = "") {
    try {
      const response = await fetch(`${API_ADMIN_CATEGORIES}${queryString ? `?${queryString}` : ""}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Failed to fetch admin categories:", error);
      return { status: 500, message: error.message || "Failed to fetch categories", data: [] };
    }
  },

  async getTrashedCategories(queryString = "") {
    try {
      const response = await fetch(`${API_ADMIN_CATEGORIES}/trashed${queryString ? `?${queryString}` : ""}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Failed to fetch trashed categories:", error);
      return { status: 500, message: error.message || "Failed to fetch trashed categories", data: [] };
    }
  },

  async restoreCategory(id) {
    try {
      const response = await fetch(`${API_ADMIN_CATEGORIES}/${id}/restore`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Failed to restore category by ID ${id}:`, error);
      return { status: 500, message: error.message || "Failed to restore category", data: null };
    }
  },

  async forceDeleteCategory(id) {
    try {
      const response = await fetch(`${API_ADMIN_CATEGORIES}/${id}/force-delete`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Failed to force delete category by ID ${id}:`, error);
      return { status: 500, message: error.message || "Failed to force delete category", data: null };
    }
  },
};
