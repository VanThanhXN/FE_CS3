import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "../../hooks/useCart";
import { formatCurrency } from "../../utils/formatCurrency";

const CartScreen = () => {
  const {
    cart,
    loading,
    error,
    updateCartItem,
    removeCartItem,
    clearCart,
    fetchCart,
  } = useCart();
  const [updatingItems, setUpdatingItems] = useState<number[]>([]);

  // Khởi tạo cart mặc định để tránh undefined
  const safeCart = {
    items: cart?.items || [],
    totalPrice: cart?.totalPrice || 0,
    totalItems: cart?.totalItems || 0,
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (cartId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      setUpdatingItems((prev) => [...prev, cartId]);
      await updateCartItem(cartId, newQuantity);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật số lượng");
    } finally {
      setUpdatingItems((prev) => prev.filter((id) => id !== cartId));
    }
  };

  const handleRemoveItem = async (cartId: number) => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          onPress: async () => {
            try {
              await removeCartItem(cartId);
            } catch (error) {
              Alert.alert("Lỗi", "Không thể xóa sản phẩm");
            }
          },
        },
      ]
    );
  };

  const handleClearCart = async () => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa toàn bộ giỏ hàng?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        onPress: async () => {
          try {
            await clearCart();
          } catch (error) {
            Alert.alert("Lỗi", "Không thể xóa giỏ hàng");
          }
        },
      },
    ]);
  };

  if (loading && safeCart.items.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7F33" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Đã xảy ra lỗi khi tải giỏ hàng</Text>
        <TouchableOpacity onPress={fetchCart} style={styles.retryButton}>
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {safeCart.items.length === 0 ? (
        <View style={styles.emptyCart}>
          <Ionicons name="cart-outline" size={64} color="#CCCCCC" />
          <Text style={styles.emptyText}>Giỏ hàng trống</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={safeCart.items}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Image
                  source={{ uri: item.productImage }}
                  style={styles.itemImage}
                  resizeMode="contain"
                />

                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.productName}</Text>
                  <Text style={styles.itemPrice}>
                    {formatCurrency(item.salePrice)}
                  </Text>

                  <View style={styles.quantityControl}>
                    <TouchableOpacity
                      onPress={() =>
                        handleUpdateQuantity(item.cartId, item.quantity - 1)
                      }
                      disabled={updatingItems.includes(item.cartId)}
                    >
                      <Ionicons
                        name="remove-circle-outline"
                        size={24}
                        color="#FF7F33"
                      />
                    </TouchableOpacity>

                    <Text style={styles.quantityText}>
                      {updatingItems.includes(item.cartId) ? (
                        <ActivityIndicator size="small" color="#FF7F33" />
                      ) : (
                        item.quantity
                      )}
                    </Text>

                    <TouchableOpacity
                      onPress={() =>
                        handleUpdateQuantity(item.cartId, item.quantity + 1)
                      }
                      disabled={updatingItems.includes(item.cartId)}
                    >
                      <Ionicons
                        name="add-circle-outline"
                        size={24}
                        color="#FF7F33"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.itemActions}>
                  <Text style={styles.itemTotal}>
                    {formatCurrency(item.subTotal)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveItem(item.cartId)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.cartId.toString()}
            contentContainerStyle={styles.listContent}
          />

          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tổng cộng:</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(safeCart.totalPrice)}
              </Text>
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.button, styles.clearButton]}
                onPress={handleClearCart}
              >
                <Text style={styles.clearButtonText}>Xóa giỏ hàng</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.checkoutButton]}
                onPress={() =>
                  Alert.alert(
                    "Thông báo",
                    "Tính năng thanh toán sẽ được cập nhật sau"
                  )
                }
              >
                <Text style={styles.checkoutButtonText}>Thanh toán</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

// Giữ nguyên styles như trước
const styles = StyleSheet.create({
  // ... (giữ nguyên phần styles từ code trước)
});

export default CartScreen;
