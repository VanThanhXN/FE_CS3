// app/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import Avatar from "../components/Avatar";
import LoadingScreen from "../components/ui/LoadingScreen";
import { useAuthCheck } from "../hooks/useAuthCheck";
import { useUser } from "../hooks/useUser";

export default function RootLayout() {
  const isAuthenticated = useAuthCheck();
  const { user } = useUser();

  if (isAuthenticated === null) {
    return <LoadingScreen />;
  }

  const renderHeaderRight = () => (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <TouchableOpacity
        onPress={() => router.push("/profile")}
        style={{ marginRight: 16 }}
      >
        <Avatar uri={user.avatar} size={32} />
      </TouchableOpacity>
    </View>
  );

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerRight: renderHeaderRight,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerBackTitleVisible: false,
      }}
    >
      {isAuthenticated ? (
        <>
          {/* Tab navigation (main app) */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* Order flow screens */}
          <Stack.Screen
            name="cart"
            options={{
              headerShown: true,
              title: "Giỏ hàng",
              headerLeft: () => (
                <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
              ),
              headerRight: renderHeaderRight,
            }}
          />
          <Stack.Screen
            name="checkout"
            options={{
              headerShown: true,
              title: "Thanh toán",
              headerLeft: () => (
                <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
              ),
              headerRight: renderHeaderRight,
            }}
          />
          <Stack.Screen
            name="orders/success"
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="orders/[id]"
            options={{
              headerShown: true,
              title: "Chi tiết đơn hàng",
              headerLeft: () => (
                <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
              ),
              headerRight: renderHeaderRight,
            }}
          />
          <Stack.Screen
            name="orders/index"
            options={{
              headerShown: true,
              title: "Đơn hàng của tôi",
              headerLeft: () => (
                <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
              ),
              headerRight: renderHeaderRight,
            }}
          />
          <Stack.Screen
            name="profile"
            options={{
              headerShown: true,
              title: "Hồ sơ cá nhân",
              headerLeft: () => (
                <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
              ),
            }}
          />
        </>
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}
