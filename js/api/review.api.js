
import { ENV } from "../config/env.js";
import { handleResponse } from "../utils/handleResponse.js";
import { getAuthHeaders } from "../utils/handleHeader.js";
import { getNoAcceptHeader } from "../utils/handleHeader.js";

const BASE_URL = ENV.BASE_URL;
const API_REVIEWS = `${BASE_URL.replace(/\/$/, "")}`;



export const ReviewAPI = {
  /**
   * Fetch approved reviews for a specific product.
   * @param {number|string} productId
   * @returns {Promise<ReviewDTO[]>}
   */
  async getByProduct(productId, queryString = "") {
    try {
      const response = await fetch(
        `${API_REVIEWS}/products/${productId}/reviews${queryString ? `?${queryString}` : ""}`,
        {
          method: "GET",
          headers: getNoAcceptHeader(),
        }
      );
      return await handleResponse(response);
    } catch (error) {
      console.error("Failed to fetch product reviews:", error);
      return [];
    }
  },

  /**
   * Fetch all approved reviews (e.g. for homepage slider).
   * @returns {Promise<ReviewDTO[]>}
   */
  async getAll(queryString = "") {
    try {
      const response = await fetch(`${API_REVIEWS}/reviews${queryString ? `?${queryString}` : ""}`, {
        method: "GET",
        headers: getNoAcceptHeader(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      return [];
    }
  },

  async createReview(reviewData) {
    try {
      const response = await fetch(`${API_REVIEWS}/reviews`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(reviewData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Failed to create review:", error);
      return null;
    }
  },

  async getById(reviewId) {
    try {
      const response = await fetch(`${API_REVIEWS}/reviews/${reviewId}`, {
        method: "GET",
        headers: getNoAcceptHeader(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Failed to fetch review:", error);
      return null;
    }
  },

  async approveReview(reviewId) {
    try {
      const response = await fetch(`${API_REVIEWS}/reviews/${reviewId}/approve`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ is_approved: true }),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Failed to approve review:", error);
      return null;
    }
  },

  async deleteReview(reviewId) {
    try {
      const response = await fetch(`${API_REVIEWS}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Failed to delete review:", error);
      return null;
    }
  },
};
