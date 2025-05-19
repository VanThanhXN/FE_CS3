// app/checkout.tsx
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useOrder } from "../hooks/useOrder";
import { formatCurrency } from "../utils/formatCurrency";

const CheckoutScreen = () => {
  const { products, total } = useLocalSearchParams();
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [shippingAddress, setShippingAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const { createOrder } = useOrder();

  // Parse products từ params
  const parsedProducts = JSON.parse(products as string);
  const parsedTotal = parseFloat(total as string);

  const handlePlaceOrder = async () => {
    if (!shippingAddress.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập địa chỉ giao hàng");
      return;
    }

    try {
      setLoading(true);
      const response = await createOrder({
        paymentMethod,
        shippingAddress,
      });

      Alert.alert("Thành công", response.message, [
        {
          text: "OK",
          onPress: () =>
            router.replace({
              pathname: "/orders/success",
              params: { orderId: response.result.orderId },
            }),
        },
      ]);
    } catch (error) {
      console.error("Error creating order:", error);
      Alert.alert("Lỗi", "Đặt hàng không thành công. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Thông tin thanh toán</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sản phẩm</Text>
        {parsedProducts.map((product) => (
          <View key={product.cartId} style={styles.productItem}>
            <Text style={styles.productName} numberOfLines={1}>
              {product.productName}
            </Text>
            <Text style={styles.productPrice}>
              {formatCurrency(product.salePrice)} x {product.quantity}
            </Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalAmount}>{formatCurrency(parsedTotal)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
        <View style={styles.paymentMethods}>
          <TouchableOpacity
            style={[
              styles.paymentMethod,
              paymentMethod === "COD" && styles.selectedMethod,
            ]}
            onPress={() => setPaymentMethod("COD")}
          >
            <MaterialIcons
              name="money-off"
              size={24}
              color={paymentMethod === "COD" ? "#FF7F33" : "#666"}
            />
            <Text
              style={[
                styles.methodText,
                paymentMethod === "COD" && styles.selectedMethodText,
              ]}
            >
              COD
            </Text>
            <Text
              style={[
                styles.methodDescription,
                paymentMethod === "COD" && styles.selectedMethodText,
              ]}
            >
              Thanh toán khi nhận hàng
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentMethod,
              paymentMethod === "MOMO" && styles.selectedMethod,
            ]}
            onPress={() => setPaymentMethod("MOMO")}
          >
            <MaterialIcons
              name="phone-android"
              size={24}
              color={paymentMethod === "MOMO" ? "#FF7F33" : "#666"}
            />
            <Text
              style={[
                styles.methodText,
                paymentMethod === "MOMO" && styles.selectedMethodText,
              ]}
            >
              MoMo
            </Text>
            <Text
              style={[
                styles.methodDescription,
                paymentMethod === "MOMO" && styles.selectedMethodText,
              ]}
            >
              Ví điện tử MoMo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentMethod,
              paymentMethod === "VNPAY" && styles.selectedMethod,
            ]}
            onPress={() => setPaymentMethod("VNPAY")}
          >
            <MaterialIcons
              name="payment"
              size={24}
              color={paymentMethod === "VNPAY" ? "#FF7F33" : "#666"}
            />
            <Text
              style={[
                styles.methodText,
                paymentMethod === "VNPAY" && styles.selectedMethodText,
              ]}
            >
              VNPay
            </Text>
            <Text
              style={[
                styles.methodDescription,
                paymentMethod === "VNPAY" && styles.selectedMethodText,
              ]}
            >
              Cổng thanh toán VNPay
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentMethod,
              paymentMethod === "BANK_TRANSFER" && styles.selectedMethod,
            ]}
            onPress={() => setPaymentMethod("BANK_TRANSFER")}
          >
            <MaterialIcons
              name="account-balance"
              size={24}
              color={paymentMethod === "BANK_TRANSFER" ? "#FF7F33" : "#666"}
            />
            <Text
              style={[
                styles.methodText,
                paymentMethod === "BANK_TRANSFER" && styles.selectedMethodText,
              ]}
            >
              Chuyển khoản
            </Text>
            <Text
              style={[
                styles.methodDescription,
                paymentMethod === "BANK_TRANSFER" && styles.selectedMethodText,
              ]}
            >
              Chuyển khoản ngân hàng
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
        <TextInput
          style={styles.addressInput}
          placeholder="Nhập địa chỉ giao hàng đầy đủ"
          value={shippingAddress}
          onChangeText={setShippingAddress}
          multiline
          numberOfLines={3}
        />
      </View>

      <TouchableOpacity
        style={styles.placeOrderButton}
        onPress={handlePlaceOrder}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.placeOrderText}>ĐẶT HÀNG</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  section: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  productName: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginRight: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FF7F33",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF7F33",
  },
  paymentMethods: {
    marginTop: 8,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  selectedMethod: {
    borderColor: "#FF7F33",
    backgroundColor: "#FFF5F0",
  },
  methodText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    flex: 1,
  },
  selectedMethodText: {
    color: "#FF7F33",
  },
  methodDescription: {
    fontSize: 14,
    color: "#999",
  },
  addressInput: {
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: "top",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  placeOrderButton: {
    backgroundColor: "#FF7F33",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  placeOrderText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default CheckoutScreen;
