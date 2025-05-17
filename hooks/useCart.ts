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

  // Hàm fetchCart với retry mechanism
  const fetchCart = async (retryCount = 0): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response: CartResponse = await CartService.getCart();

      // Validate response
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

      // Auto-retry up to 3 times
      if (retryCount < 3) {
        setTimeout(() => fetchCart(retryCount + 1), 1000 * (retryCount + 1));
      } else {
        Alert.alert("Error", "Failed to load cart. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Hàm thêm vào giỏ hàng với optimistic update
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
                  cartId: Date.now(), // Temporary ID
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
      setCart(response.result);
      return response;
    } catch (err) {
      setError(err as Error);
      // Revert optimistic update on error
      fetchCart();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Hàm cập nhật số lượng với transaction state
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
      setCart(response.result);
      return response;
    } catch (err) {
      setError(err as Error);
      fetchCart(); // Revert to server state on error
      throw err;
    } finally {
      setLoading(false);
      setUpdatingItems((prev) => prev.filter((id) => id !== cartId));
    }
  };

  // Hàm xóa item với confirmation dialog
  const removeCartItem = async (cartId: number): Promise<CartResponse> => {
    try {
      setLoading(true);

      // Optimistic update
      setCart((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.cartId !== cartId),
      }));

      const response = await CartService.removeCartItem(cartId);
      setCart(response.result);
      return response;
    } catch (err) {
      setError(err as Error);
      fetchCart(); // Revert to server state on error
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Hàm clear cart với confirmation
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
      setCart(response.result);
      return response;
    } catch (err) {
      setError(err as Error);
      fetchCart(); // Revert to server state on error
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Effect để fetch cart khi component mount
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
