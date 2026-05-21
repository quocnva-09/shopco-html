import { ENV } from "../config/env.js";
import { handleResponse } from "../utils/handleResponse.js";
import { getUploadHeaders } from "../utils/handleHeader.js";

const BASE_URL = ENV.BASE_URL.replace(/\/$/, "");

/**
 * Helper to build headers for multipart/form-data upload requests.
 * We must NOT set Content-Type so the browser sets the boundary automatically.
 *
 * @returns {Object} The header configuration.
 */

export const UploadAPI = {
  /**
   * Upload a product image (admin only).
   *
   * @param {File|Blob} file - The image file to upload.
   * @returns {Promise<Object|null>} The response, or null on failure.
   */
  async uploadProductImage(file) {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${BASE_URL}/admin/products/upload`, {
        method: "POST",
        headers: getUploadHeaders(),
        body: formData,
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("UploadAPI.uploadProductImage error:", error);
      return null;
    }
  },

  /**
   * Upload a user profile image.
   *
   * @param {File|Blob} file - The image file to upload.
   * @returns {Promise<Object|null>} The response, or null on failure.
   */
  async uploadUserProfileImage(file) {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${BASE_URL}/users/upload`, {
        method: "POST",
        headers: getUploadHeaders(),
        body: formData,
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("UploadAPI.uploadUserProfileImage error:", error);
      return null;
    }
  },
};
