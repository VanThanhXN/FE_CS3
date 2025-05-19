// app/orders/[id].tsx
import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useOrder } from "../../hooks/useOrder";

const OrderDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fetchOrder, cancelOrder } = useOrder();

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const response = await fetchOrder(Number(id));
        setOrder(response.result);
      } catch (error) {
        console.error("Error fetching order:", error);
        Alert.alert("Lỗi", "Không thể tải thông tin đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn hủy đơn hàng này?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Đồng ý",
        onPress: async () => {
          try {
            const response = await cancelOrder(Number(id));
            setOrder(response.result);
            Alert.alert("Thành công", response.message);
          } catch (error) {
            console.error("Error cancelling order:", error);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải thông tin đơn hàng...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <Text>Không tìm thấy đơn hàng</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.orderId}>Đơn hàng #{order.orderId}</Text>
        <View
          style={[
            styles.statusBadge,
            order.status === "PENDING" && styles.statusPending,
            order.status === "CANCELLED" && styles.statusCancelled,
          ]}
        >
          <Text style={styles.statusText}>
            {order.status === "PENDING" ? "Đang chờ" : "Đã hủy"}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={20} color="#666" />
          <Text style={styles.infoText}>
            Ngày đặt: {new Date(order.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="cash-outline" size={20} color="#666" />
          <Text style={styles.infoText}>
            Phương thức: {getPaymentMethodName(order.paymentMethod)}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={20} color="#666" />
          <Text style={styles.infoText}>Địa chỉ: {order.shippingAddress}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chi tiết đơn hàng</Text>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalAmount}>
            {order.totalAmount.toLocaleString()}đ
          </Text>
        </View>
      </View>

      {order.status === "PENDING" && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancelOrder}
        >
          <Feather name="x-circle" size={20} color="#FF3B30" />
          <Text style={styles.cancelButtonText}>Hủy đơn hàng</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const getPaymentMethodName = (method) => {
  switch (method) {
    case "COD":
      return "Thanh toán khi nhận hàng";
    case "MOMO":
      return "Ví điện tử MoMo";
    case "VNPAY":
      return "VNPay";
    case "BANK_TRANSFER":
      return "Chuyển khoản ngân hàng";
    default:
      return method;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  orderId: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: "#FFF3E0",
  },
  statusCancelled: {
    backgroundColor: "#FFEBEE",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  section: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF7F33",
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  cancelButtonText: {
    marginLeft: 8,
    color: "#FF3B30",
    fontWeight: "bold",
  },
});

export default OrderDetailScreen;
