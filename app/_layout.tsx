import { Stack } from "expo-router";
import LoadingScreen from "../components/ui/LoadingScreen";
import { useAuthCheck } from "../hooks/useAuthCheck";

export default function RootLayout() {
  const isAuthenticated = useAuthCheck();

  if (isAuthenticated === null) {
    return <LoadingScreen />;
  }

  return (
    <Stack>
      {isAuthenticated ? (
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            animation: "fade",
          }}
        />
      ) : (
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
            animation: "fade",
          }}
        />
      )}
    </Stack>
  );
}
