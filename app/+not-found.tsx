import { router } from "expo-router";
import { Button, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Không tìm thấy trang
      </Text>
      <Button
        title="Về trang chủ"
        onPress={() => router.replace("/")}
        color="#FF7F33"
      />
    </View>
  );
}
