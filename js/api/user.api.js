import { ENV } from "../config/env.js";

const BASE_URL = ENV.BASE_URL;

// ─────────────────────────────────────────────────────────────
// Shared fetch wrapper
// ─────────────────────────────────────────────────────────────

/**
 * Shared authenticated fetch wrapper.
 * Returns a normalized { data, meta, error } object — never throws.
 *
 * @param {string} endpoint - Path relative to BASE_URL (e.g. '/admin/users').
 * @param {RequestInit} [options={}] - Fetch options (method, body, etc.).
 * @returns {Promise<{ data: any, meta: any, error: string|null }>}
 */
async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("access_token");

  const defaultHeaders = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
      },
    });

    const json = await response.json();

    if (!response.ok) {
      const message = json?.message || `Request failed with status ${response.status}`;
      return { data: null, meta: null, error: message };
    }

    return {
      data: json?.data ?? json,
      meta: json?.meta ?? null,
      error: null,
    };
  } catch (err) {
    return { data: null, meta: null, error: err.message || "Network error" };
  }
}

// ─────────────────────────────────────────────────────────────
// User-facing endpoints
// ─────────────────────────────────────────────────────────────

/**
 * Updates a user's own profile.
 * Uses /users/:id (no /admin/ prefix) per API specification.
 *
 * @param {number|string} id - The user's ID.
 * @param {{ name?: string, email?: string, phone?: string, bio?: string, address?: string }} data
 * @returns {Promise<{ data: Object, meta: null, error: string|null }>}
 */
export async function updateUserProfile(id, data) {
  return apiFetch(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ─────────────────────────────────────────────────────────────
// Admin endpoints
// ─────────────────────────────────────────────────────────────

/**
 * Fetches a paginated list of active users (admin).
 *
 * @param {{ page?: number, per_page?: number, search?: string, sort_by?: string, sort_dir?: string }} [params={}]
 * @returns {Promise<{ data: Array, meta: Object, error: string|null }>}
 */
export async function getUsers(params = {}) {
  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== "" && v !== null && v !== undefined)
    )
  ).toString();

  return apiFetch(`/admin/users${query ? `?${query}` : ""}`);
}

/**
 * Fetches a single user by ID (admin).
 *
 * @param {number|string} id - The user's ID.
 * @returns {Promise<{ data: Object, meta: null, error: string|null }>}
 */
export async function getUser(id) {
  return apiFetch(`/admin/users/${id}`);
}

/**
 * Creates a new user (admin).
 *
 * @param {{ name: string, email: string, password: string, role?: string, phone?: string, address?: string }} data
 * @returns {Promise<{ data: Object, meta: null, error: string|null }>}
 */
export async function createUser(data) {
  return apiFetch("/admin/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
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
  return apiFetch(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Soft-deletes a user — moves to trash (admin).
 *
 * @param {number|string} id - The user's ID.
 * @returns {Promise<{ data: Object, meta: null, error: string|null }>}
 */
export async function deleteUser(id) {
  return apiFetch(`/admin/users/${id}`, {
    method: "DELETE",
  });
}

/**
 * Fetches a paginated list of soft-deleted (trashed) users (admin).
 *
 * @param {{ page?: number, per_page?: number, search?: string }} [params={}]
 * @returns {Promise<{ data: Array, meta: Object, error: string|null }>}
 */
export async function getTrashedUsers(params = {}) {
  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== "" && v !== null && v !== undefined)
    )
  ).toString();

  return apiFetch(`/admin/users/trashed${query ? `?${query}` : ""}`);
}

/**
 * Restores a soft-deleted user from trash (admin).
 *
 * @param {number|string} id - The user's ID.
 * @returns {Promise<{ data: Object, meta: null, error: string|null }>}
 */
export async function restoreUser(id) {
  return apiFetch(`/admin/users/${id}/restore`, {
    method: "PATCH",
  });
}

/**
 * Permanently deletes a trashed user — cannot be undone (admin).
 *
 * @param {number|string} id - The user's ID.
 * @returns {Promise<{ data: Object, meta: null, error: string|null }>}
 */
export async function forceDeleteUser(id) {
  return apiFetch(`/admin/users/${id}/force-delete`, {
    method: "DELETE",
  });
}
