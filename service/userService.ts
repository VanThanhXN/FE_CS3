// service/userService.ts
import apiClient from "./apiClient";
import * as FileSystem from "expo-file-system";
import { UserEndpoints } from "../constants/ApiEndpoints";

export interface User {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  phone: string | null;
  address: string | null;
  avatar: string;
  role: string;
  createdAt: string;
}

export const UserService = {
  // Lấy thông tin người dùng hiện tại
  getMe: async (): Promise<{ code: number; result: User }> => {
    const response = await apiClient.get(UserEndpoints.GET_USER_INFO);
    return response.data;
  },

  // Cập nhật avatar
  updateAvatar: async (
    uri: string
  ): Promise<{ code: number; result: User }> => {
    const fileInfo = await FileSystem.getInfoAsync(uri);

    if (!fileInfo.exists) {
      throw new Error("File does not exist");
    }

    const formData = new FormData();
    formData.append("avatar", {
      uri,
      name: `avatar_${Date.now()}.jpg`,
      type: "image/jpeg",
    } as any);

    const response = await apiClient.put(
      UserEndpoints.UPDATE_AVATAR,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  // Cập nhật thông tin người dùng
  updateProfile: async (data: {
    fullName?: string;
    phone?: string;
    address?: string;
  }): Promise<{ code: number; result: User }> => {
    const response = await apiClient.put(UserEndpoints.UPDATE_PROFILE, data);
    return response.data;
  },

  // Đổi mật khẩu
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ code: number; message: string }> => {
    const response = await apiClient.put(UserEndpoints.CHANGE_PASSWORD, data);
    return response.data;
  },
};
