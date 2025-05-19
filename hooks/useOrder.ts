// hooks/useOrder.ts
import { useState } from "react";
import { OrderService } from "../service/oder/orderService";

export const useOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (data: {
    paymentMethod: string;
    shippingAddress: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      return await OrderService.createOrder(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Tạo đơn hàng thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: number) => {
    try {
      setLoading(true);
      setError(null);
      return await OrderService.cancelOrder(orderId);
    } catch (err: any) {
      setError(err.response?.data?.message || "Hủy đơn hàng thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchOrder = async (orderId: number) => {
    try {
      setLoading(true);
      setError(null);
      return await OrderService.getOrder(orderId);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Lấy thông tin đơn hàng thất bại"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      return await OrderService.getOrders();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Lấy danh sách đơn hàng thất bại"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createOrder,
    cancelOrder,
    fetchOrder,
    fetchOrders,
  };
};
