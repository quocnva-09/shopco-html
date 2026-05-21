import { ExportAPI } from "../api/export.api.js";
import { ExportDTO } from "../models/export.dto.js";

export const ExportService = {
  /**
   * Trigger a new product export job.
   *
   * @param {Object} params - The parameters for the export job.
   * @returns {Promise<Object>} The operation result.
   */
  async exportProducts(params = {}) {
    try {
      const data = {
        format: params.format || "xlsx",
        search: params.search || "",
      };
      const response = await ExportAPI.triggerProductExport(data);
      const isSuccess =
        response && (response.status === 202 || response.status === 200);
      if (isSuccess) {
        return {
          success: true,
          message: response.message || "Export started.",
          data: response.data ? new ExportDTO(response.data) : null,
        };
      }
      return {
        success: false,
        error: response?.message || "Failed to trigger export",
      };
    } catch (error) {
      console.error("ExportService.exportProducts Error:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Fetch all export history records.
   *
   * @param {Object|string} params - Optional parameters or query string.
   * @returns {Promise<Object>} The paginated result.
   */
  async getAll(params = {}) {
    try {
      let queryParams = [];

      if (typeof params === "object") {
        const limit = params.limit || 10;
        const page = params.page;

        if (limit) queryParams.push(`limit=${limit}`);
        if (page) queryParams.push(`page=${page}`);
      } else if (typeof params === "string") {
        queryParams.push(params);
      }

      const queryString = queryParams.join("&");
      const response = await ExportAPI.getAll(queryString);

      if (response && response.data) {
        const items = response.data.map((item) => new ExportDTO(item));
        return {
          success: true,
          items: items,
          meta: response.meta || null,
        };
      }
      return { success: false, error: "Invalid response format" };
    } catch (error) {
      console.error("ExportService.getAll Error:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get a single export job record by ID.
   *
   * @param {number|string} id - The export job ID.
   * @returns {Promise<Object>} The fetch result.
   */
  async getById(id) {
    try {
      const response = await ExportAPI.getById(id);
      if (response && (response.status === 200 || response.data)) {
        return {
          success: true,
          data: new ExportDTO(response.data || response),
        };
      }
      return {
        success: false,
        error: response?.message || "Failed to get export job",
      };
    } catch (error) {
      console.error("ExportService.getById Error:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get the download URL for a completed export.
   *
   * @param {number|string} id - The export job ID.
   * @returns {Promise<Object>} The download URL result.
   */
  async getDownloadUrl(id) {
    try {
      const response = await ExportAPI.getDownloadUrl(id);
      if (response && (response.status === 200 || response.data)) {
        return {
          success: true,
          downloadUrl: response.data.download_url || "",
        };
      }
      return {
        success: false,
        error: response?.message || "Failed to get download URL",
      };
    } catch (error) {
      console.error("ExportService.getDownloadUrl Error:", error);
      return { success: false, error: error.message };
    }
  },
};
