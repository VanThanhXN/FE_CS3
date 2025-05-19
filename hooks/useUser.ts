// hooks/useUser.ts
import { useEffect, useState } from "react";
import { UserService } from "../service/userService";
import { clearToken, getToken } from "../storage/storage";

// Giá trị mặc định cho user
const DEFAULT_USER = {
  userId: 0,
  username: "",
  email: "",
  fullName: "",
  phone: null,
  address: null,
  avatar: "",
  role: "GUEST",
  createdAt: new Date().toISOString(),
};

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      if (!token) {
        setUser(null);
        return;
      }

      const response = await UserService.getMe();
      setUser(response.result);
    } catch (err: any) {
      console.error("Error fetching user:", err);
      setError(
        err.response?.data?.message || "Không thể tải thông tin người dùng"
      );

      // Clear token nếu có lỗi 401 (Unauthorized)
      if (err.response?.status === 401) {
        await clearToken();
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearUser = async (): Promise<void> => {
    try {
      await clearToken();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error("Error clearing user:", err);
      setError("Không thể đăng xuất");
      throw err;
    }
  };

  const updateAvatar = async (uri: string): Promise<void> => {
    if (!user) {
      throw new Error("User not available");
    }

    try {
      setLoading(true);
      await UserService.updateAvatar(uri);
      await fetchUser(); // Refresh user data
    } catch (err: any) {
      console.error("Error updating avatar:", err);
      setError(
        err.response?.data?.message || "Không thể cập nhật ảnh đại diện"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: {
    fullName?: string;
    phone?: string;
    address?: string;
  }): Promise<void> => {
    try {
      setLoading(true);
      await UserService.updateProfile(data);
      await fetchUser(); // Refresh user data
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Không thể cập nhật thông tin");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
    try {
      setLoading(true);
      await UserService.changePassword(data);
    } catch (err: any) {
      console.error("Error changing password:", err);
      setError(err.response?.data?.message || "Không thể đổi mật khẩu");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user: user || DEFAULT_USER,
    loading,
    error,
    fetchUser,
    clearUser,
    updateAvatar,
    updateProfile,
    changePassword,
  };
};
