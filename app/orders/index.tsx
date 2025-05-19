// app/orders/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useOrder } from "../../hooks/useOrder";

const OrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { fetchOrders } = useOrder();

  const loadOrders = async () => {
    try {
      setRefreshing(true);
      const response = await fetchOrders();
      setOrders(response.result);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => router.push(`/orders/${item.orderId}`)}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Đơn hàng #{item.orderId}</Text>
        <Text style={styles.orderAmount}>
          {item.totalAmount.toLocaleString()}đ
        </Text>
      </View>

      <View style={styles.orderInfo}>
        <View style={styles.orderStatus}>
          <View
            style={[
              styles.statusDot,
              item.status === "PENDING" && styles.statusPending,
              item.status === "CANCELLED" && styles.statusCancelled,
            ]}
          />
          <Text style={styles.statusText}>
            {item.status === "PENDING" ? "Đang chờ" : "Đã hủy"}
          </Text>
        </View>
        <Text style={styles.orderDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.orderId.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadOrders}
            colors={["#FF7F33"]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={48} color="#CCCCCC" />
            <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  listContent: {
    padding: 16,
  },
  orderItem: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF7F33",
  },
  orderInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusPending: {
    backgroundColor: "#FFA000",
  },
  statusCancelled: {
    backgroundColor: "#FF3B30",
  },
  statusText: {
    fontSize: 14,
    color: "#666",
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
});

export default OrdersScreen;
