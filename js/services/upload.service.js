import { UploadAPI } from "../api/upload.api.js";
import { UploadDTO } from "../models/upload.dto.js";

export const UploadService = {
  /**
   * Upload a product image.
   *
   * @param {File|Blob} file - The file to upload.
   * @returns {Promise<Object>} The operation result.
   */
  async uploadProductImage(file) {
    try {
      if (!file) {
        return { success: false, error: "No file provided" };
      }

      const response = await UploadAPI.uploadProductImage(file);
      const isSuccess = response && (response.status === 200 || response.data);

      if (isSuccess) {
        return {
          success: true,
          message: response.message || "Uploaded successfully",
          data: response.data ? new UploadDTO(response.data) : null,
        };
      }

      return {
        success: false,
        error: response?.message || "Failed to upload image",
      };
    } catch (error) {
      console.error("UploadService.uploadProductImage error:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Upload a user profile image.
   *
   * @param {File|Blob} file - The file to upload.
   * @returns {Promise<Object>} The operation result.
   */
  async uploadUserProfileImage(file) {
    try {
      if (!file) {
        return { success: false, error: "No file provided" };
      }

      console.log("File to upload", file)

      const response = await UploadAPI.uploadUserProfileImage(file);
      const isSuccess = response && (response.status === 200 || response.data);

      if (isSuccess) {
        console.log("Upload image successfully", response.data);
        return {
          success: true,
          message: response.message || "Uploaded successfully",
          data: response.data ? new UploadDTO(response.data) : null,
        };
      }

      return {
        success: false,
        error: response?.message || "Failed to upload image",
      };
    } catch (error) {
      console.error("UploadService.uploadUserProfileImage error:", error);
      return { success: false, error: error.message };
    }
  },
};
