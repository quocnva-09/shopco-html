import { UserAPI } from "../api/user.api.js";
import { UserDTO } from "../models/user.dto.js";

// ─────────────────────────────────────────────────────────────
// Helper: map raw API data → UserDTO
// ─────────────────────────────────────────────────────────────

/**
 * Maps a single raw user object to a UserDTO instance.
 *
 * @param {Object} raw - Raw user data from the API.
 * @returns {UserDTO}
 */
function toDTO(raw) {
    return new UserDTO(raw);
}

/**
 * Maps an array of raw user objects to UserDTO instances.
 *
 * @param {Object[]} rawList
 * @returns {UserDTO[]}
 */
function toDTOList(rawList) {
    return Array.isArray(rawList) ? rawList.map(toDTO) : [];
}

// ─────────────────────────────────────────────────────────────
// User Service
// ─────────────────────────────────────────────────────────────

export const UserService = {
    /**
     * Updates the currently authenticated user's own profile.
     * Also persists the updated UserDTO to localStorage.
     *
     * @param {number|string} id - The user's ID.
     * @param {{ name?: string, email?: string, phone?: string, bio?: string, address?: string }} data
     * @returns {Promise<{ success: boolean, user?: UserDTO, error?: string }>}
     */
    async updateProfile(id, data) {
        try {
            const { data: raw, error } = await UserAPI.updateUserProfile(id, data);

            if (error) {
                return { success: false, error };
            }

            const user = toDTO(raw);
            localStorage.setItem("user", JSON.stringify(user));
            return { success: true, user };
        } catch (err) {
            return { success: false, error: err.message };
        }
    },

    /**
     * Fetches a paginated list of active users and maps them to UserDTOs.
     *
     * @param {{ page?: number, per_page?: number, search?: string }} [params={}]
     * @returns {Promise<{ users: UserDTO[], meta: Object|null, error: string|null }>}
     */
    async fetchUsers(params = {}) {
        const query = new URLSearchParams(
            Object.fromEntries(
                Object.entries(params).filter(
                    ([, v]) => v !== "" && v !== null && v !== undefined
                )
            )
        ).toString();
        const { data, meta, error } = await UserAPI.getUsers(query);
        return {
            users: toDTOList(data),
            meta,
            error,
        };
    },

    /**
     * Fetches a single user by ID and maps to a UserDTO.
     *
     * @param {number|string} id
     * @returns {Promise<{ user: UserDTO|null, error: string|null }>}
     */
    async fetchUser(id) {
        const { data, error } = await UserAPI.getUser(id);
        return {
            data: data ? toDTO(data) : null,
            error,
        };
    },

    /**
     * Creates a new user (admin). Returns the created UserDTO on success.
     *
     * @param {{ name: string, email: string, password: string, role?: string, phone?: string, address?: string }} data
     * @returns {Promise<{ user: UserDTO|null, error: string|null }>}
     */
    async addUser(data) {
        const { data: raw, error } = await UserAPI.createUser(data);
        return {
            user: raw ? toDTO(raw) : null,
            error,
        };
    },

    /**
     * Updates a user's data (admin). Returns the updated UserDTO on success.
     *
     * @param {number|string} id
     * @param {{ name?: string, email?: string, phone?: string, bio?: string, address?: string }} data
     * @returns {Promise<{ user: UserDTO|null, error: string|null }>}
     */
    async editUser(id, data) {
        const { data: raw, error } = await UserAPI.updateUser(id, data);
        return {
            user: raw ? toDTO(raw) : null,
            error,
        };
    },

    /**
     * Soft-deletes a user (moves to trash, admin).
     *
     * @param {number|string} id
     * @returns {Promise<{ success: boolean, error: string|null }>}
     */
    async trashUser(id) {
        const { error } = await UserAPI.deleteUser(id);
        return { success: !error, error: error ?? null };
    },

    /**
     * Fetches a paginated list of soft-deleted (trashed) users and maps to UserDTOs.
     *
     * @param {{ page?: number, per_page?: number, search?: string }} [params={}]
     * @returns {Promise<{ users: UserDTO[], meta: Object|null, error: string|null }>}
     */
    async fetchTrashedUsers(params = {}) {
        const query = new URLSearchParams(
            Object.fromEntries(
                Object.entries(params).filter(
                    ([, v]) => v !== "" && v !== null && v !== undefined
                )
            )
        ).toString();
        const { data, meta, error } = await UserAPI.getTrashedUsers(query);
        return {
            users: toDTOList(data),
            meta,
            error,
        };
    },

    /**
     * Restores a soft-deleted user from trash (admin).
     *
     * @param {number|string} id
     * @returns {Promise<{ success: boolean, error: string|null }>}
     */
    async recoverUser(id) {
        const { error } = await UserAPI.restoreUser(id);
        return { success: !error, error: error ?? null };
    },

    /**
     * Permanently deletes a trashed user — cannot be undone (admin).
     *
     * @param {number|string} id
     * @returns {Promise<{ success: boolean, error: string|null }>}
     */
    async destroyUser(id) {
        const { error } = await UserAPI.forceDeleteUser(id);
        return { success: !error, error: error ?? null };
    }
};
