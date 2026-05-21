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
    const rawReviews = Array.isArray(rawData) ? rawData : rawData.data || [];
    return rawReviews.map((r) => new ReviewDTO(r));
  },

  /**
   * Fetch all approved reviews (e.g. for homepage slider).
   * @param {Object|string} params
   * @returns {Promise<Object>}
   */
  async getAll(params = {}) {
    try {
      let queryParams = [];

      if (typeof params === "object") {
        const keyword = params.search || params.keyword;
        const sortBy = params.sort || params.sort_by;
        const sortDirection = params.order || params.sort_direction;
        const limit = params.limit || 8;
        const page = params.page;

        if (keyword) queryParams.push(`keyword=${encodeURIComponent(keyword)}`);
        if (sortBy) queryParams.push(`sort_by=${encodeURIComponent(sortBy)}`);
        if (sortDirection)
          queryParams.push(
            `sort_direction=${encodeURIComponent(sortDirection)}`,
          );
        if (limit) queryParams.push(`limit=${limit}`);
        if (page) queryParams.push(`page=${page}`);
      } else if (typeof params === "string") {
        queryParams.push(params);
      } else {
        queryParams.push("limit=8");
      }

      const queryString = queryParams.join("&");
      const response = await ReviewAPI.getAll(queryString);

      if (response && response.data) {
        const reviews = response.data.map((r) => new ReviewDTO(r));
        return {
          success: true,
          reviews: reviews,
          items: reviews,
          meta: response.meta,
          links: response.links,
        };
      } else if (Array.isArray(response)) {
        const reviews = response.map((r) => new ReviewDTO(r));
        return {
          success: true,
          reviews: reviews,
          items: reviews,
          meta: null,
        };
      }
      return { success: false, error: "Invalid response format" };
    } catch (error) {
      console.error("ReviewService Error:", error);
      return { success: false, error: error.message };
    }
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
    try {
      const response = await ReviewAPI.getById(reviewId);
      if (response && (response.status === 200 || response.data)) {
        const review = new ReviewDTO(response.data || response);
        return {
          success: true,
          data: review,
        };
      }
      return {
        success: false,
        error: response.message || "Failed to get review",
      };
    } catch (error) {
      console.error("ReviewService Error:", error);
      return { success: false, error: error.message };
    }
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
