import { ENV } from "../config/env.js";
import { handleResponse } from "../utils/handleResponse.js";
import { getAuthHeaders } from "../utils/handleHeader.js";

const BASE_URL = ENV.BASE_URL;
const API_ADMIN_EXPORT = `${BASE_URL.replace(/\/$/, "")}/admin/exports`;

export const ExportAPI = {
    /**
     * Trigger a new product export job.
     * 
     * @param {Object} exportData - The export options (e.g. format, search).
     * @returns {Promise<Object|null>} The response data, or null on error.
     */
    async triggerProductExport(exportData) {
        try {
            const response = await fetch(`${API_ADMIN_EXPORT}/products`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(exportData),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Failed to trigger product export:", error);
            return null;
        }
    },

    /**
     * Fetch all export history records.
     * 
     * @param {string} queryString - Optional search/filter query string.
     * @returns {Promise<Object|null>} The response data, or null on error.
     */
    async getAll(queryString = "") {
        try {
            const url = `${API_ADMIN_EXPORT}${
                queryString ? `?${queryString}` : ""
            }`;
            const response = await fetch(url, {
                method: "GET",
                headers: getAuthHeaders(),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Failed to fetch export history:", error);
            return null;
        }
    },

    /**
     * Get a single export job record by ID.
     * 
     * @param {number|string} id - The export job ID.
     * @returns {Promise<Object|null>} The response data, or null on error.
     */
    async getById(id) {
        try {
            const response = await fetch(`${API_ADMIN_EXPORT}/${id}`, {
                method: "GET",
                headers: getAuthHeaders(),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Failed to fetch export job ${id}:`, error);
            return null;
        }
    },

    /**
     * Get the download URL for a completed export.
     * 
     * @param {number|string} id - The export job ID.
     * @returns {Promise<Object|null>} The response data, or null on error.
     */
    async getDownloadUrl(id) {
        try {
            const url = `${API_ADMIN_EXPORT}/${id}/download`;
            const response = await fetch(url, {
                method: "GET",
                headers: getAuthHeaders(),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Failed to fetch download URL for job ${id}:`, error);
            return null;
        }
    },
};

