import { ReviewAPI } from "../api/review.api.js";
import { ReviewDTO } from "../models/review.dto.js";

export const ReviewService = {
  /**
   * Fetch approved reviews for a specific product.
   * @param {number|string} productId
   * @returns {Promise<ReviewDTO[]>}
   */
  async getByProduct(productId) {
    const queryString = "limit=6";
    const rawData = await ReviewAPI.getByProduct(productId, queryString);
    const rawReviews = Array.isArray(rawData) ? rawData : (rawData.data || []);
    return rawReviews.map((r) => new ReviewDTO(r));
  },

  /**
   * Fetch all approved reviews (e.g. for homepage slider).
   * @returns {Promise<ReviewDTO[]>}
   */
  async getAll() {
    const queryString = "limit=8";
    const rawData = await ReviewAPI.getAll(queryString);
    const rawReviews = Array.isArray(rawData) ? rawData : (rawData.data || []);
    return rawReviews.map((r) => new ReviewDTO(r));
  },

  async createReview(reviewData) {
    const rawData = await ReviewAPI.createReview(reviewData);
    if (rawData && rawData.data) {
      return new ReviewDTO(rawData.data);
    }
    return null;
  },

  /**
   * Fetch a single review by ID.
   * @param {number|string} reviewId
   * @returns {Promise<ReviewDTO|null>}
   */
  async getById(reviewId) {
    const rawData = await ReviewAPI.getById(reviewId);
    if (rawData && rawData.data) {
      return new ReviewDTO(rawData.data);
    }
    return null;
  },

  /**
   * Approve a review (admin).
   * @param {number|string} reviewId
   * @returns {Promise<ReviewDTO|null>}
   */
  async approveReview(reviewId) {
    const rawData = await ReviewAPI.approveReview(reviewId);
    if (rawData && rawData.data) {
      return new ReviewDTO(rawData.data);
    }
    return null;
  },

  /**
   * Delete a review.
   * @param {number|string} reviewId
   * @returns {Promise<boolean>}
   */
  async deleteReview(reviewId) {
    const rawData = await ReviewAPI.deleteReview(reviewId);
    return !!(rawData && !rawData.error);
  },

};
