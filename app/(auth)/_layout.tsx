import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(auth)/LoginScreen"
        options={{ title: "Đăng nhập" }}
      />
      <Stack.Screen
        name="(auth)/RegisterScreen"
        options={{ title: "Đăng ký" }}
      />
    </Stack>
  );
}
