import { ProductAPI } from "../api/product.api.js";
import { ProductDTO } from "../models/product.dto.js";

export const ProductService = {
  getAllProducts: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(
        Object.fromEntries(
          Object.entries(params).filter(
            ([, v]) => v !== "" && v !== null && v !== undefined,
          ),
        ),
      ).toString();
      const rawData = await ProductAPI.getAll(queryString);

      // Ensure the response was successful and data array exists
      if (rawData.status !== 200) {
        throw new Error(rawData.message || "Failed to fetch products");
      }

      const productsArray = rawData.data || [];

      // Map the raw backend data to our frontend DTO format
      return productsArray.map((productData) => new ProductDTO(productData));
    } catch (error) {
      console.error("Error in ProductService.getAllProducts:", error);
      throw error;
    }
  },

  getProductById: async (id) => {
    try {
      const rawData = await ProductAPI.getById(id);

      if (rawData.status !== 200) {
        throw new Error(rawData.message || "Failed to fetch product");
      }

      return new ProductDTO(rawData.data);
    } catch (error) {
      console.error(`Error in ProductService.getProductById(${id}):`, error);
      throw error;
    }
  },

  // ---------------------------------------------------------------------------
  // ADMIN ENDPOINTS
  // ---------------------------------------------------------------------------

  createProduct: async (data) => {
    try {
      const rawData = await ProductAPI.createProduct(data);
      if (rawData && (rawData.status === 201 || rawData.data)) {
        return {
          success: true,
          product: new ProductDTO(rawData.data || rawData),
          message: rawData.message,
        };
      }
      return {
        success: false,
        error: rawData?.message || "Failed to create product",
      };
    } catch (error) {
      console.error("Error in ProductService.createProduct:", error);
      return { success: false, error: error.message };
    }
  },

  updateProduct: async (id, data) => {
    try {
      const rawData = await ProductAPI.updateProduct(id, data);
      if (rawData && (rawData.status === 200 || rawData.data)) {
        return {
          success: true,
          product: new ProductDTO(rawData.data || rawData),
        };
      }
      return {
        success: false,
        error: rawData?.message || "Failed to update product",
      };
    } catch (error) {
      console.error(`Error in ProductService.updateProduct(${id}):`, error);
      return { success: false, error: error.message };
    }
  },

  deleteProduct: async (id) => {
    try {
      const rawData = await ProductAPI.deleteProduct(id);
      if (rawData && rawData.status >= 200 && rawData.status < 300) {
        return { success: true, message: rawData.message };
      }
      return {
        success: false,
        error: rawData?.message || "Failed to delete product",
      };
    } catch (error) {
      console.error(`Error in ProductService.deleteProduct(${id}):`, error);
      return { success: false, error: error.message };
    }
  },

  getAdminProducts: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(
        Object.fromEntries(
          Object.entries(params).filter(
            ([, v]) => v !== "" && v !== null && v !== undefined,
          ),
        ),
      ).toString();
      const rawData = await ProductAPI.getAdminProducts(queryString);

      if (rawData && (rawData.status === 200 || rawData.data)) {
        const productsArray = rawData.data || [];
        return {
          success: true,
          products: productsArray.map((p) => new ProductDTO(p)),
          meta: rawData.meta || null,
        };
      }
      return {
        success: false,
        error: rawData?.message || "Failed to fetch admin products",
      };
    } catch (error) {
      console.error("Error in ProductService.getAdminProducts:", error);
      return { success: false, error: error.message };
    }
  },

  getTrashedProducts: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(
        Object.fromEntries(
          Object.entries(params).filter(
            ([, v]) => v !== "" && v !== null && v !== undefined,
          ),
        ),
      ).toString();
      const rawData = await ProductAPI.getTrashedProducts(queryString);

      if (rawData && (rawData.status === 200 || rawData.data)) {
        const productsArray = rawData.data || [];
        return {
          success: true,
          products: productsArray.map((p) => new ProductDTO(p)),
          meta: rawData.meta || null,
        };
      }
      return {
        success: false,
        error: rawData?.message || "Failed to fetch trashed products",
      };
    } catch (error) {
      console.error("Error in ProductService.getTrashedProducts:", error);
      return { success: false, error: error.message };
    }
  },

  restoreProduct: async (id) => {
    try {
      const rawData = await ProductAPI.restoreProduct(id);
      if (rawData && (rawData.status === 200 || rawData.data)) {
        return {
          success: true,
          product: new ProductDTO(rawData.data || rawData),
        };
      }
      return {
        success: false,
        error: rawData?.message || "Failed to restore product",
      };
    } catch (error) {
      console.error(`Error in ProductService.restoreProduct(${id}):`, error);
      return { success: false, error: error.message };
    }
  },

  forceDeleteProduct: async (id) => {
    try {
      const rawData = await ProductAPI.forceDeleteProduct(id);
      if (rawData && rawData.status >= 200 && rawData.status < 300) {
        return { success: true, message: rawData.message };
      }
      return {
        success: false,
        error: rawData?.message || "Failed to force delete product",
      };
    } catch (error) {
      console.error(
        `Error in ProductService.forceDeleteProduct(${id}):`,
        error,
      );
      return { success: false, error: error.message };
    }
  },
};
