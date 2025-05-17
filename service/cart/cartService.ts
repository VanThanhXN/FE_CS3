import { CartEndpoints } from "../../constants/ApiEndpoints";
import apiClient from "../apiClient";

export interface CartItem {
  cartId: number;
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  salePrice: number;
  quantity: number;
  subTotal: number;
  addedAt: string;
}

export interface CartResponse {
  code: number;
  message?: string;
  result: {
    items: CartItem[];
    totalPrice: number;
    totalItems: number;
  };
}

export const CartService = {
  getCart: async (): Promise<CartResponse> => {
    const response = await apiClient.get(CartEndpoints.GET_CART);
    return response.data;
  },

  addToCart: async (
    productId: number,
    quantity: number = 1
  ): Promise<CartResponse> => {
    const response = await apiClient.post(CartEndpoints.ADD_TO_CART, {
      productId,
      quantity,
    });
    return response.data;
  },

  updateCartItem: async (
    cartId: number,
    quantity: number
  ): Promise<CartResponse> => {
    const response = await apiClient.put(
      `${CartEndpoints.UPDATE_CART_ITEM}/${cartId}?quantity=${quantity}`
    );
    return response.data;
  },

  removeCartItem: async (cartId: number): Promise<CartResponse> => {
    const response = await apiClient.delete(
      `${CartEndpoints.REMOVE_CART_ITEM}/${cartId}`
    );
    return response.data;
  },

  clearCart: async (): Promise<CartResponse> => {
    const response = await apiClient.delete(CartEndpoints.CLEAR_CART);
    return response.data;
  },
};
