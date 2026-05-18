import { OrderAPI } from "../api/order.api.js";
import { OrderDTO } from "../models/order.dto.js";

export const OrderService = {
  getUserOrders: async (page = 1) => {
    try {
      const response = await OrderAPI.getUserOrders(page);
      
      if (response && response.data) {
        const orders = response.data.map(orderData => new OrderDTO(orderData));
        return {
          success: true,
          orders: orders,
          meta: response.meta,
          links: response.links
        };
      }
      return { success: false, error: "Invalid response format" };
    } catch (error) {
      console.error("OrderService Error:", error);
      return { success: false, error: error.message };
    }
  },
};
