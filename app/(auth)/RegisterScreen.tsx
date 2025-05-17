import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useAuth } from "../../hooks/useAuth";

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
  });

  const { register, isLoading, error } = useAuth();

  const handleChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      await register(formData);
      Alert.alert("Thành công", "Đăng ký thành công!");
      // Có thể điều hướng về màn hình login hoặc home
    } catch (err) {
      Alert.alert("Lỗi", error || "Đăng ký thất bại");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Đăng ký tài khoản</Text>

      <TextInput
        placeholder="Tên đăng nhập"
        value={formData.username}
        onChangeText={(text) => handleChange("username", text)}
      />

      <TextInput
        placeholder="Mật khẩu"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => handleChange("password", text)}
      />

      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
      />

      <TextInput
        placeholder="Họ và tên"
        value={formData.fullName}
        onChangeText={(text) => handleChange("fullName", text)}
      />

      <Button
        title={isLoading ? "Đang xử lý..." : "Đăng ký"}
        onPress={handleSubmit}
        disabled={isLoading}
      />
    </View>
  );
};

export default RegisterScreen;
