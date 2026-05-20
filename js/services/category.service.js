import { CategoryAPI } from "../api/category.api.js";
import { CategoryDTO } from "../models/category.dto.js";

const mapToDTO = (data) => new CategoryDTO(data);
const mapListToDTO = (data) => Array.isArray(data) ? data.map(mapToDTO) : [];

export const CategoryService = {
  // ---------------------------------------------------------------------------
  // PUBLIC ENDPOINTS
  // ---------------------------------------------------------------------------

  getPublicCategories: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(
        Object.fromEntries(
          Object.entries(params).filter(([, v]) => v !== "" && v !== null && v !== undefined)
        )
      ).toString();
      const response = await CategoryAPI.getPublicCategories(queryString);
      
      if (response && (response.status === 200 || response.data)) {
        return {
          success: true,
          categories: mapListToDTO(response.data || response),
          meta: response.meta || null
        };
      }
      return { success: false, error: response?.message || "Failed to fetch categories" };
    } catch (error) {
      console.error("CategoryService Error:", error);
      return { success: false, error: error.message };
    }
  },

  getPublicCategory: async (id) => {
    try {
      const response = await CategoryAPI.getPublicCategory(id);
      
      if (response && (response.status === 200 || response.data)) {
        return {
          success: true,
          category: mapToDTO(response.data || response)
        };
      }
      return { success: false, error: response?.message || "Failed to fetch category" };
    } catch (error) {
      console.error("CategoryService Error:", error);
      return { success: false, error: error.message };
    }
  },

  // ---------------------------------------------------------------------------
  // ADMIN ENDPOINTS
  // ---------------------------------------------------------------------------

  createCategory: async (data) => {
    try {
      const response = await CategoryAPI.createCategory(data);
      if (response && (response.status === 201 || response.data)) {
        return {
          success: true,
          category: mapToDTO(response.data || response),
          message: response.message
        };
      }
      return { success: false, error: response?.message || "Failed to create category" };
    } catch (error) {
      console.error("CategoryService Error:", error);
      return { success: false, error: error.message };
    }
  },

  updateCategory: async (id, data) => {
    try {
      const response = await CategoryAPI.updateCategory(id, data);
      if (response && (response.status === 200 || response.data)) {
        return {
          success: true,
          category: mapToDTO(response.data || response)
        };
      }
      return { success: false, error: response?.message || "Failed to update category" };
    } catch (error) {
      console.error("CategoryService Error:", error);
      return { success: false, error: error.message };
    }
  },

  deleteCategory: async (id) => {
    try {
      const response = await CategoryAPI.deleteCategory(id);
      if (response && response.status >= 200 && response.status < 300) {
        return { success: true, message: response.message };
      }
      return { success: false, error: response?.message || "Failed to delete category" };
    } catch (error) {
      console.error("CategoryService Error:", error);
      return { success: false, error: error.message };
    }
  },

  getAdminCategory: async (id) => {
    try {
      const response = await CategoryAPI.getAdminCategory(id);
      if (response && (response.status === 200 || response.data)) {
        return {
          success: true,
          category: mapToDTO(response.data || response)
        };
      }
      return { success: false, error: response?.message || "Failed to fetch admin category" };
    } catch (error) {
      console.error("CategoryService Error:", error);
      return { success: false, error: error.message };
    }
  },

  getAdminCategories: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(
        Object.fromEntries(
          Object.entries(params).filter(([, v]) => v !== "" && v !== null && v !== undefined)
        )
      ).toString();
      const response = await CategoryAPI.getAdminCategories(queryString);
      
      if (response && (response.status === 200 || response.data)) {
        return {
          success: true,
          categories: mapListToDTO(response.data || response),
          meta: response.meta || null
        };
      }
      return { success: false, error: response?.message || "Failed to fetch admin categories" };
    } catch (error) {
      console.error("CategoryService Error:", error);
      return { success: false, error: error.message };
    }
  },

  getTrashedCategories: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(
        Object.fromEntries(
          Object.entries(params).filter(([, v]) => v !== "" && v !== null && v !== undefined)
        )
      ).toString();
      const response = await CategoryAPI.getTrashedCategories(queryString);
      
      if (response && (response.status === 200 || response.data)) {
        return {
          success: true,
          categories: mapListToDTO(response.data || response),
          meta: response.meta || null
        };
      }
      return { success: false, error: response?.message || "Failed to fetch trashed categories" };
    } catch (error) {
      console.error("CategoryService Error:", error);
      return { success: false, error: error.message };
    }
  },

  restoreCategory: async (id) => {
    try {
      const response = await CategoryAPI.restoreCategory(id);
      if (response && (response.status === 200 || response.data)) {
        return {
          success: true,
          category: mapToDTO(response.data || response)
        };
      }
      return { success: false, error: response?.message || "Failed to restore category" };
    } catch (error) {
      console.error("CategoryService Error:", error);
      return { success: false, error: error.message };
    }
  },

  forceDeleteCategory: async (id) => {
    try {
      const response = await CategoryAPI.forceDeleteCategory(id);
      if (response && response.status >= 200 && response.status < 300) {
        return { success: true, message: response.message };
      }
      return { success: false, error: response?.message || "Failed to force delete category" };
    } catch (error) {
      console.error("CategoryService Error:", error);
      return { success: false, error: error.message };
    }
  }
};
