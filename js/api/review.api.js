import { ReviewDTO } from "../models/review.dto.js";
import { ENV } from "../config/env.js";

const BASE_URL = ENV.BASE_URL;
const API_REVIEWS = `${BASE_URL.replace(/\/$/, "")}`;

export const ReviewAPI = {
  /**
   * Fetch approved reviews for a specific product.
   * @param {number|string} productId
   * @returns {Promise<ReviewDTO[]>}
   */
  async getByProduct(productId) {
    try {
      const response = await fetch(
        `${API_REVIEWS}/products/${productId}/reviews?limit=6`,
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      // Map raw API responses to ReviewDTO objects
      return data.data.map((review) => new ReviewDTO(review));
    } catch (error) {
      console.error("Failed to fetch product reviews:", error);
      return [];
    }
  },

  /**
   * Fetch all approved reviews (e.g. for homepage slider).
   * @returns {Promise<ReviewDTO[]>}
   */
  async getAll() {
    try {
      const response = await fetch(`${API_REVIEWS}/reviews?limit=8`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      // Map raw API responses to ReviewDTO objects
      return data.data.map((review) => new ReviewDTO(review));
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      return [];
    }
  },
};
