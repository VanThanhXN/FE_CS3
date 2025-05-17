import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 10 }}>Đang tải...</Text>
    </View>
  );
}
