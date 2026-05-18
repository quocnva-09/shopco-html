import { ProductAPI } from "../api/product.api.js";
import { ProductDTO } from "../models/product.dto.js";

export const ProductService = {
  getAllProducts: async () => {
    try {
      const rawData = await ProductAPI.getAll();

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
};
