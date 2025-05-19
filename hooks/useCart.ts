// hooks/useCart.ts
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { CartService } from "../service/cart/cartService";

interface CartItem {
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

interface CartData {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}

interface CartResponse {
  code: number;
  message?: string;
  result: CartData;
}

export const useCart = () => {
  const [cart, setCart] = useState<CartData>({
    items: [],
    totalPrice: 0,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [updatingItems, setUpdatingItems] = useState<number[]>([]);

  const fetchCart = async (retryCount = 0): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response: CartResponse = await CartService.getCart();

      if (!response.result || !Array.isArray(response.result.items)) {
        throw new Error("Invalid cart data structure");
      }

      setCart({
        items: response.result.items || [],
        totalPrice: response.result.totalPrice || 0,
        totalItems: response.result.totalItems || 0,
      });
    } catch (err) {
      setError(err as Error);
      if (retryCount < 3) {
        setTimeout(() => fetchCart(retryCount + 1), 1000 * (retryCount + 1));
      } else {
        Alert.alert("Error", "Failed to load cart. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (
    productId: number,
    quantity: number = 1
  ): Promise<CartResponse> => {
    try {
      setLoading(true);

      // Optimistic update
      setCart((prev) => {
        const existingItem = prev.items.find(
          (item) => item.productId === productId
        );
        return {
          ...prev,
          items: existingItem
            ? prev.items.map((item) =>
                item.productId === productId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            : [
                ...prev.items,
                {
                  cartId: Date.now(),
                  productId,
                  productName: "Loading...",
                  productImage: "",
                  price: 0,
                  salePrice: 0,
                  quantity,
                  subTotal: 0,
                  addedAt: new Date().toISOString(),
                },
              ],
          totalItems: prev.totalItems + quantity,
        };
      });

      const response = await CartService.addToCart(productId, quantity);

      // Sau khi thêm thành công, fetch lại giỏ hàng từ server
      await fetchCart();

      return response;
    } catch (err) {
      setError(err as Error);
      // Revert optimistic update on error
      await fetchCart();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (
    cartId: number,
    quantity: number
  ): Promise<CartResponse> => {
    if (quantity < 1) {
      throw new Error("Quantity must be at least 1");
    }

    try {
      setUpdatingItems((prev) => [...prev, cartId]);
      setLoading(true);

      // Optimistic update
      setCart((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.cartId === cartId ? { ...item, quantity } : item
        ),
      }));

      const response = await CartService.updateCartItem(cartId, quantity);
      await fetchCart(); // Fetch lại sau khi cập nhật
      return response;
    } catch (err) {
      setError(err as Error);
      await fetchCart();
      throw err;
    } finally {
      setLoading(false);
      setUpdatingItems((prev) => prev.filter((id) => id !== cartId));
    }
  };

  const removeCartItem = async (cartId: number): Promise<CartResponse> => {
    try {
      setLoading(true);

      // Optimistic update
      setCart((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.cartId !== cartId),
      }));

      const response = await CartService.removeCartItem(cartId);
      await fetchCart(); // Fetch lại sau khi xóa
      return response;
    } catch (err) {
      setError(err as Error);
      await fetchCart();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async (): Promise<CartResponse> => {
    try {
      setLoading(true);

      // Optimistic update
      setCart({
        items: [],
        totalPrice: 0,
        totalItems: 0,
      });

      const response = await CartService.clearCart();
      await fetchCart(); // Fetch lại sau khi xóa toàn bộ
      return response;
    } catch (err) {
      setError(err as Error);
      await fetchCart();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return {
    cart,
    loading,
    error,
    updatingItems,
    fetchCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
  };
};
export default useCart;
