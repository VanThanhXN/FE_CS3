import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "auth_token";

export const storeToken = async (token: string | null) => {
  try {
    if (token) {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } else {
      await clearToken(); // Gọi clearToken nếu token là null
    }
  } catch (error) {
    console.error("Lỗi khi lưu token:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Lỗi khi lấy token:", error);
    return null;
  }
};

export const clearToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error("Lỗi khi xóa token:", error);
    throw error;
  }
};
