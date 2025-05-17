import axios from "axios";
import { API_BASE_URL } from "../constants/ApiEndpoints";
import { getToken, clearToken } from "../storage/storage";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor để tự động thêm token vào header
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Xử lý response
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      clearToken();
      // Có thể thêm logic redirect về màn hình login ở đây
    }
    return Promise.reject(error);
  }
);

export default apiClient;
