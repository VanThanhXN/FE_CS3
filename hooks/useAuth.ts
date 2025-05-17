import { router } from "expo-router";
import { useState } from "react";
import { AuthService } from "../service/authService";
import { storeToken } from "../storage/storage";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: {
    username: string;
    password: string;
    email: string;
    fullName: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AuthService.register(data);
      setIsLoading(false);
      return response;
    } catch (err: any) {
      setIsLoading(false);
      setError(err.response?.data?.message || "Đăng ký thất bại");
      throw err;
    }
  };
  const login = async (data: { username: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AuthService.login(data);
      const token = response.result.token; // Lấy token từ response.result

      if (!token) {
        throw new Error("Token không hợp lệ từ server");
      }

      await storeToken(token);
      router.replace("/(tabs)");
      return response;
    } catch (err: any) {
      setIsLoading(false);
      setError(
        err.response?.data?.message || err.message || "Đăng nhập thất bại"
      );
      throw err;
    }
  };
  return { register, login, isLoading, error };
};
