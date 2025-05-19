import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="LoginScreen" options={{ title: "Đăng nhập" }} />
      <Stack.Screen name="RegisterScreen" options={{ title: "Đăng ký" }} />
    </Stack>
  );
}
