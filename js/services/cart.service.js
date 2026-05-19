import { CartAPI } from "../api/cart.api.js";
import { CartDTO } from "../models/cart.dto.js";

/**
 * Service for handling cart business logic
 */
export const CartService = {
  /**
   * Fetch the current cart from API and return as DTO
   * @returns {Promise<CartDTO>}
   */
  getCart: async () => {
    try {
      const response = await CartAPI.getCart();
      if (response != null) {
        return new CartDTO(response.data);
      }
      return null;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  },

  /**
   * Add a product to the cart
   * @param {number} productId
   * @param {number} quantity
   * @param {object} options
   * @returns {Promise<CartDTO>}
   */
  addItem: async (productId, quantity = 1, options = {}) => {
    try {
      const response = await CartAPI.add({
        product_id: productId,
        quantity,
        options,
      });
      return new CartDTO(response.data);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      throw error;
    }
  },

  /**
   * Update the quantity of a specific cart item
   * @param {number} itemId
   * @param {number} quantity
   * @returns {Promise<CartDTO>}
   */
  updateItemQuantity: async (itemId, quantity) => {
    try {
      const response = await CartAPI.updateItem(itemId, { quantity });
      return new CartDTO(response.data);
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      throw error;
    }
  },

  /**
   * Remove a specific item from the cart
   * @param {number} itemId
   * @returns {Promise<CartDTO>}
   */
  removeItem: async (itemId) => {
    try {
      const response = await CartAPI.removeItem(itemId);
      return new CartDTO(response.data);
    } catch (error) {
      console.error("Error removing cart item:", error);
      throw error;
    }
  },

  /**
   * Clear all items from the cart
   * @returns {Promise<CartDTO>}
   */
  clearCart: async () => {
    try {
      const response = await CartAPI.clear();
      return new CartDTO(response.data);
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  },

  /**
   * Get the total number of items in the cart
   * @returns {Promise<number>}
   */
  countItems: async () => {
    try {
      const response = await CartAPI.count();
      return response.data.count || 0;
    } catch (error) {
      console.error("Error counting cart items:", error);
      return 0;
    }
  },
};
