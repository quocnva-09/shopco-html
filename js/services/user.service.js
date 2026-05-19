import { UserAPI } from "../api/user.api.js";
import { UserDTO } from "../models/user.dto.js";

export const UserService = {
  updateProfile: async (id, data) => {
    try {
      const response = await UserAPI.update(id, data);

      if (response && response.data) {
        const userDTO = new UserDTO(response.data);
        localStorage.setItem("user", JSON.stringify(userDTO));
        return {
          success: true,
          user: userDTO,
          message: response.message,
        };
      }
      return {
        success: false,
        error: response.message || "Failed to update user profile",
      };
    } catch (error) {
      console.error("UserService Error:", error);
      return { success: false, error: error.message };
    }
  },
};
