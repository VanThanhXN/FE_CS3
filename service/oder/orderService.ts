// service/orderService.ts
import apiClient from "../apiClient";

export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface Order {
  orderId: number;
  totalAmount: number;
  paymentMethod: string;
  shippingAddress: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export const OrderService = {
  createOrder: async (data: {
    paymentMethod: string;
    shippingAddress: string;
  }): Promise<{ code: number; message: string; result: Order }> => {
    const response = await apiClient.post("/orders/create", data);
    return response.data;
  },

  getOrder: async (
    orderId: number
  ): Promise<{ code: number; result: Order }> => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  },

  cancelOrder: async (
    orderId: number
  ): Promise<{
    code: number;
    message: string;
    result: Order;
  }> => {
    const response = await apiClient.put(`/orders/${orderId}/cancel`);
    return response.data;
  },

  getOrders: async (): Promise<{ code: number; result: Order[] }> => {
    const response = await apiClient.get("/orders");
    return response.data;
  },

  getOrderStatus: async (
    orderId: number
  ): Promise<{
    code: number;
    result: {
      orderId: number;
      status: string;
      message: string;
    };
  }> => {
    const response = await apiClient.get(`/orders/${orderId}/status`);
    return response.data;
  },
};
