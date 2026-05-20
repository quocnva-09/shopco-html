import { ENV } from "../config/env.js";
import { handleResponse } from "../utils/handleResponse.js";
import { getAuthHeaders } from "../utils/handleHeader.js";

const BASE_URL = ENV.BASE_URL;
const API_USERS = `${BASE_URL.replace(/\/$/, "")}`;

/**
 * Updates a user's own profile.
 * Uses /users/:id (no /admin/ prefix) per API specification.
 *
 * @param {number|string} id - The user's ID.
 * @param {{ name?: string, email?: string, phone?: string, bio?: string, address?: string }} data
 * @returns {Promise<{ data: Object, meta: null, error: string|null }>}
 */
export async function updateUserProfile(id, data) {
  try {
    const response = await fetch(`${API_USERS}/users/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const json = await handleResponse(response);
    return {
      data: json?.data ?? json,
      meta: json?.meta ?? null,
      error: null,
    };
  } catch (error) {
    console.error(`Failed to update user profile for ID ${id}:`, error);
    return { data: null, meta: null, error: error.message || "Failed to update profile" };
  }
}

/**
 * Fetches a paginated list of active users (admin).
 *
 * @param {string} [queryString=""]
 * @returns {Promise<{ data: Array, meta: Object, error: string|null }>}
 */
export async function getUsers(queryString = "") {
  try {
    const response = await fetch(`${API_USERS}/admin/users${queryString ? `?${queryString}` : ""}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    const json = await handleResponse(response);
    return {
      data: json?.data ?? json,
      meta: json?.meta ?? null,
      error: null,
    };
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return { data: null, meta: null, error: error.message || "Failed to fetch users" };
  }
}

/**
 * Fetches a single user by ID (admin).
 *
 * @param {number|string} id - The user's ID.
 * @returns {Promise<{ data: Object, meta: null, error: string|null }>}
 */
export async function getUser(id) {
  try {
    const response = await fetch(`${API_USERS}/admin/users/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    const json = await handleResponse(response);
    return {
      data: json?.data ?? json,
      meta: json?.meta ?? null,
      error: null,
    };
  } catch (error) {
    console.error(`Failed to fetch user by ID ${id}:`, error);
    return { data: null, meta: null, error: error.message || "Failed to fetch user" };
  }
}

/**
 * Creates a new user (admin).
 *
 * @param {{ name: string, email: string, password: string, role?: string, phone?: string, address?: string }} data
 * @returns {Promise<{ data: Object, meta: null, error: string|null }>}
 */
export async function createUser(data) {
  try {
    const response = await fetch(`${API_USERS}/admin/users`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const json = await handleResponse(response);
    return {
      data: json?.data ?? json,
      meta: json?.meta ?? null,
      error: null,
    };
  } catch (error) {
    console.error("Failed to create user:", error);
    return { data: null, meta: null, error: error.message || "Failed to create user" };
  }
}

/**
 * Updates a user's data (admin).
 * Note: Delegates to the user-facing /users/:id endpoint per API spec.
 *
 * @param {number|string} id - The user's ID.
 * @param {{ name?: string, email?: string, phone?: string, bio?: string, address?: string }} data
 * @returns {Promise<{ data: Object, meta: null, error: string|null }>}
 */
export async function updateUser(id, data) {
  try {
    const response = await fetch(`${API_USERS}/users/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const json = await handleResponse(response);
    return {
      data: json?.data ?? json,
      meta: json?.meta ?? null,
      error: null,
    };
  } catch (error) {
    console.error(`Failed to update user ID ${id}:`, error);
    return { data: null, meta: null, error: error.message || "Failed to update user" };
  }
}

/**
 * Soft-deletes a user — moves to trash (admin).
 *
 * @param {number|string} id - The user's ID.
 * @returns {Promise<{ data: Object, meta: null, error: string|null }>}
 */
export async function deleteUser(id) {
  try {
    const response = await fetch(`${API_USERS}/admin/users/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    const json = await handleResponse(response);
    return {
      data: json?.data ?? json,
      meta: json?.meta ?? null,
      error: null,
    };
  } catch (error) {
    console.error(`Failed to delete user ID ${id}:`, error);
    return { data: null, meta: null, error: error.message || "Failed to delete user" };
  }
}

/**
 * Fetches a paginated list of soft-deleted (trashed) users (admin).
 *
 * @param {string} [queryString=""]
 * @returns {Promise<{ data: Array, meta: Object, error: string|null }>}
 */
export async function getTrashedUsers(queryString = "") {
  try {
    const response = await fetch(`${API_USERS}/admin/users/trashed${queryString ? `?${queryString}` : ""}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    const json = await handleResponse(response);
    return {
      data: json?.data ?? json,
      meta: json?.meta ?? null,
      error: null,
    };
  } catch (error) {
    console.error("Failed to fetch trashed users:", error);
    return { data: null, meta: null, error: error.message || "Failed to fetch trashed users" };
  }
}

/**
 * Restores a soft-deleted user from trash (admin).
 *
 * @param {number|string} id - The user's ID.
 * @returns {Promise<{ data: Object, meta: null, error: string|null }>}
 */
export async function restoreUser(id) {
  try {
    const response = await fetch(`${API_USERS}/admin/users/${id}/restore`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });
    const json = await handleResponse(response);
    return {
      data: json?.data ?? json,
      meta: json?.meta ?? null,
      error: null,
    };
  } catch (error) {
    console.error(`Failed to restore user ID ${id}:`, error);
    return { data: null, meta: null, error: error.message || "Failed to restore user" };
  }
}

/**
 * Permanently deletes a trashed user — cannot be undone (admin).
 *
 * @param {number|string} id - The user's ID.
 * @returns {Promise<{ data: Object, meta: null, error: string|null }>}
 */
export async function forceDeleteUser(id) {
  try {
    const response = await fetch(`${API_USERS}/admin/users/${id}/force-delete`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    const json = await handleResponse(response);
    return {
      data: json?.data ?? json,
      meta: json?.meta ?? null,
      error: null,
    };
  } catch (error) {
    console.error(`Failed to force delete user ID ${id}:`, error);
    return { data: null, meta: null, error: error.message || "Failed to force delete user" };
  }
}

export const UserAPI = {
  updateUserProfile,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getTrashedUsers,
  restoreUser,
  forceDeleteUser,
};
