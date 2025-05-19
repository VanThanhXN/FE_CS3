import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
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
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Khởi tạo giỏ hàng mặc định
  const safeCart = {
    items: cart?.items || [],
    totalPrice: cart?.totalPrice || 0,
    totalItems: cart?.totalItems || 0,
  };

  // Tính tổng giá trị các sản phẩm được chọn
  const selectedTotalPrice = safeCart.items
    .filter((item) => selectedItems.includes(item.cartId))
    .reduce((sum, item) => sum + item.subTotal, 0);

  // Load giỏ hàng khi component mount
  useEffect(() => {
    fetchCart();
  }, []);

  // Xử lý refresh khi kéo xuống
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchCart();
      setSelectedItems([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Chọn/bỏ chọn một sản phẩm
  const toggleSelectItem = (cartId: number) => {
    setSelectedItems((prev) =>
      prev.includes(cartId)
        ? prev.filter((id) => id !== cartId)
        : [...prev, cartId]
    );
  };

  // Chọn tất cả/bỏ chọn tất cả
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(safeCart.items.map((item) => item.cartId));
    }
    setSelectAll(!selectAll);
  };

  // Cập nhật số lượng sản phẩm
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

  // Xóa một sản phẩm
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
              setSelectedItems((prev) => prev.filter((id) => id !== cartId));
            } catch (error) {
              Alert.alert("Lỗi", "Không thể xóa sản phẩm");
            }
          },
        },
      ]
    );
  };

  // Xóa các sản phẩm đã chọn
  const handleRemoveSelected = async () => {
    if (selectedItems.length === 0) return;

    Alert.alert(
      "Xác nhận",
      `Bạn có chắc muốn xóa ${selectedItems.length} sản phẩm đã chọn?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          onPress: async () => {
            try {
              for (const cartId of selectedItems) {
                await removeCartItem(cartId);
              }
              setSelectedItems([]);
              setSelectAll(false);
            } catch (error) {
              Alert.alert("Lỗi", "Không thể xóa sản phẩm");
            }
          },
        },
      ]
    );
  };

  // Thanh toán các sản phẩm đã chọn
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn ít nhất một sản phẩm");
      return;
    }

    const selectedProducts = safeCart.items.filter((item) =>
      selectedItems.includes(item.cartId)
    );

    router.navigate({
      pathname: "/checkout",
      params: {
        products: JSON.stringify(selectedProducts),
        total: selectedTotalPrice,
      },
    });
  };

  // Hiển thị loading khi chưa có dữ liệu
  if (loading && safeCart.items.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7F33" />
      </View>
    );
  }

  // Hiển thị lỗi nếu có
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

  // Hiển thị giỏ hàng trống
  if (safeCart.items.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={styles.emptyScrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#FF7F33"]}
            tintColor="#FF7F33"
          />
        }
      >
        <View style={styles.emptyCart}>
          <Ionicons name="cart-outline" size={80} color="#E0E0E0" />
          <Text style={styles.emptyTitle}>Giỏ hàng của bạn trống</Text>
          <Text style={styles.emptySubtitle}>
            Hãy thêm sản phẩm để bắt đầu mua sắm
          </Text>
          <TouchableOpacity
            style={styles.shopNowButton}
            onPress={() => router.navigate("/")}
          >
            <Text style={styles.shopNowText}>Mua sắm ngay</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // Hiển thị giỏ hàng
  return (
    <View style={styles.container}>
      <FlatList
        data={safeCart.items}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <TouchableOpacity
              onPress={() => toggleSelectItem(item.cartId)}
              style={styles.selectButton}
            >
              <Ionicons
                name={
                  selectedItems.includes(item.cartId)
                    ? "checkbox"
                    : "square-outline"
                }
                size={20}
                color={selectedItems.includes(item.cartId) ? "#FF7F33" : "#666"}
              />
            </TouchableOpacity>

            <Image
              source={{ uri: item.productImage }}
              style={styles.itemImage}
              resizeMode="contain"
            />

            <View style={styles.itemDetails}>
              <Text style={styles.itemName} numberOfLines={2}>
                {item.productName}
              </Text>
              <Text style={styles.itemPrice}>
                {formatCurrency(item.salePrice)}
              </Text>

              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  onPress={() =>
                    handleUpdateQuantity(item.cartId, item.quantity - 1)
                  }
                  disabled={updatingItems.includes(item.cartId)}
                >
                  <Ionicons
                    name="remove-circle-outline"
                    size={24}
                    color={
                      updatingItems.includes(item.cartId) || item.quantity <= 1
                        ? "#CCCCCC"
                        : "#FF7F33"
                    }
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
                    color={
                      updatingItems.includes(item.cartId)
                        ? "#CCCCCC"
                        : "#FF7F33"
                    }
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#FF7F33"]}
            tintColor="#FF7F33"
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <TouchableOpacity
              onPress={toggleSelectAll}
              style={styles.selectAllButton}
            >
              <Ionicons
                name={selectAll ? "checkbox" : "square-outline"}
                size={24}
                color={selectAll ? "#FF7F33" : "#666"}
              />
              <Text style={styles.selectAllText}>Chọn tất cả</Text>
            </TouchableOpacity>
            <Text style={styles.itemCount}>{safeCart.totalItems} sản phẩm</Text>
          </View>
        }
      />

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <View style={styles.selectedSummary}>
            <Text style={styles.selectedText}>
              Đã chọn {selectedItems.length}/{safeCart.items.length} sản phẩm
            </Text>
            <TouchableOpacity
              onPress={handleRemoveSelected}
              disabled={selectedItems.length === 0}
            >
              <Text
                style={[
                  styles.removeSelectedText,
                  selectedItems.length === 0 && styles.disabledText,
                ]}
              >
                Xóa
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tạm tính:</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(selectedTotalPrice)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí vận chuyển:</Text>
            <Text style={styles.summaryValue}>Miễn phí</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(selectedTotalPrice)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.checkoutButton,
            selectedItems.length === 0 && styles.disabledButton,
          ]}
          onPress={handleCheckout}
          disabled={selectedItems.length === 0}
        >
          <Text style={styles.checkoutButtonText}>
            Thanh toán ({selectedItems.length})
          </Text>
          <Ionicons
            name="arrow-forward"
            size={20}
            color={selectedItems.length === 0 ? "#AAA" : "#FFF"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  emptyScrollContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#FF7F33",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  emptyCart: {
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
    marginBottom: 24,
  },
  shopNowButton: {
    backgroundColor: "#FF7F33",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopNowText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  selectAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectAllText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  itemCount: {
    fontSize: 14,
    color: "#666",
  },
  listContent: {
    paddingBottom: 16,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectButton: {
    padding: 8,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF7F33",
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  quantityText: {
    width: 40,
    textAlign: "center",
    fontSize: 16,
    color: "#333",
  },
  itemActions: {
    alignItems: "flex-end",
    marginLeft: 12,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  deleteButton: {
    padding: 8,
  },
  summaryContainer: {
    padding: 16,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  summaryCard: {
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  selectedSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  selectedText: {
    fontSize: 14,
    color: "#666",
  },
  removeSelectedText: {
    fontSize: 14,
    color: "#FF3B30",
  },
  disabledText: {
    color: "#AAA",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#666",
  },
  summaryValue: {
    fontSize: 16,
    color: "#333",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF7F33",
  },
  divider: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 12,
  },
  checkoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF7F33",
    padding: 16,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: "#DDD",
  },
  checkoutButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 8,
  },
});

export default CartScreen;
