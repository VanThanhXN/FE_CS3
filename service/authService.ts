import { AuthEndpoints } from "../constants/ApiEndpoints";
import apiClient from "./apiClient";

export interface AuthResponse {
  code: number;
  result: {
    token: string;
    authenticated: boolean;
  };
}
export interface RegisterData {
  username: string;
  password: string;
  email: string;
  fullName: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export const AuthService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post(AuthEndpoints.REGISTER, data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post(AuthEndpoints.LOGIN, data);
    if (!response.data?.result?.token) {
      throw new Error("Không nhận được token từ server");
    }
    return response.data;
  },
  getMe: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },
  updateAvatar: async (
    formData: FormData
  ): Promise<{ code: number; result: User }> => {
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
};
