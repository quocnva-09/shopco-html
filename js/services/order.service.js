import { OrderAPI } from "../api/order.api.js";
import { OrderDTO } from "../models/order.dto.js";

export const OrderService = {
  getUserOrders: async (page = 1) => {
    try {
      const queryString = `page=${page}`;
      const response = await OrderAPI.getUserOrders(queryString);

      if (response && response.data) {
        const orders = response.data.map(
          (orderData) => new OrderDTO(orderData),
        );
        return {
          success: true,
          orders: orders,
          meta: response.meta,
          links: response.links,
        };
      }
      return { success: false, error: "Invalid response format" };
    } catch (error) {
      console.error("OrderService Error:", error);
      return { success: false, error: error.message };
    }
  },

  getAllOrders: async (page = 1) => {
    try {
      const queryString = `page=${page}`;
      const response = await OrderAPI.getAllOrders(queryString);

      if (response && response.data) {
        const orders = response.data.map(
          (orderData) => new OrderDTO(orderData),
        );
        return {
          success: true,
          orders: orders,
          meta: response.meta,
          links: response.links,
        };
      }
      return { success: false, error: "Invalid response format" };
    } catch (error) {
      console.error("OrderService Error:", error);
      return { success: false, error: error.message };
    }
  },

  createOrder: async () => {
    try {
      const response = await OrderAPI.createOrder();
      if (response && response.status === 201) {
        return {
          success: true,
          order: new OrderDTO(response.data || response),
          message: response.message,
        };
      }
      return {
        success: false,
        error: response.message || "Failed to create order",
      };
    } catch (error) {
      console.error("OrderService Error:", error);
      return { success: false, error: error.message };
    }
  },

  updateStatus: async (orderId, status) => {
    try {
      const response = await OrderAPI.updateStatus(orderId, status);
      if (response && (response.status === 200 || response.data)) {
        return {
          success: true,
          order: new OrderDTO(response.data || response),
        };
      }
      return { success: false, error: response.message || "Failed to update" };
    } catch (error) {
      console.error("OrderService Error:", error);
      return { success: false, error: error.message };
    }
  },

  getOrderById: async (orderId) => {
    try {
      const response = await OrderAPI.getOrderById(orderId);
      if (response && (response.status === 200 || response.data)) {
        return {
          success: true,
          order: new OrderDTO(response.data || response),
        };
      }
      return { success: false, error: response.message || "Failed to get order" };
    } catch (error) {
      console.error("OrderService Error:", error);
      return { success: false, error: error.message };
    }
  }
};
