// app/orders/create.tsx
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useOrder } from "../../hooks/useOrder";
import { Picker } from "@react-native-picker/picker";

const CreateOrderScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [shippingAddress, setShippingAddress] = useState("");
  const { loading, error, createOrder } = useOrder();

  const handleCreateOrder = async () => {
    try {
      const response = await createOrder({
        paymentMethod,
        shippingAddress,
      });

      Alert.alert("Thành công", response.message, [
        {
          text: "OK",
          onPress: () => router.replace(`/orders/${response.result.orderId}`),
        },
      ]);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tạo đơn hàng mới</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phương thức thanh toán</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={paymentMethod}
            onValueChange={(itemValue) => setPaymentMethod(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Thanh toán khi nhận hàng (COD)" value="COD" />
            <Picker.Item label="Ví điện tử MoMo" value="MOMO" />
            <Picker.Item label="VNPay" value="VNPAY" />
            <Picker.Item label="Chuyển khoản ngân hàng" value="BANK_TRANSFER" />
          </Picker>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Địa chỉ giao hàng</Text>
        <TextInput
          style={styles.input}
          value={shippingAddress}
          onChangeText={setShippingAddress}
          placeholder="Nhập địa chỉ giao hàng"
          multiline
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity
        style={styles.button}
        onPress={handleCreateOrder}
        disabled={loading || !shippingAddress}
      >
        <Text style={styles.buttonText}>
          {loading ? "Đang xử lý..." : "Đặt hàng"}
        </Text>
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
    marginBottom: 24,
    color: "#333",
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  button: {
    backgroundColor: "#FF7F33",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: "#FF3B30",
    textAlign: "center",
    marginVertical: 10,
  },
});

export default CreateOrderScreen;
