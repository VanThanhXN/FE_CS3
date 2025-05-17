export const API_BASE_URL = "http://192.168.1.13:8080";

export const AuthEndpoints = {
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  // Thêm các endpoint khác sau này
};

export const ProductEndpoints = {
  GET_ALL_PRODUCTS: `${API_BASE_URL}/products`,
  GET_PRODUCT_BY_ID: (id: number) => `${API_BASE_URL}/products/${id}`,
  SEARCH_PRODUCTS: `${API_BASE_URL}/products/search`,
  GET_PRODUCTS_BY_CATEGORY: (categoryId: number) =>
    `${API_BASE_URL}/products/category/${categoryId}`,
};

export const CategoryEndpoints = {
  GET_ALL_CATEGORIES: `${API_BASE_URL}/categories`,
};

export const CartEndpoints = {
  GET_CART: `${API_BASE_URL}/cart`,
  ADD_TO_CART: `${API_BASE_URL}/cart/add`,
  UPDATE_CART_ITEM: `${API_BASE_URL}/cart/update`,
  REMOVE_CART_ITEM: `${API_BASE_URL}/cart/remove`,
  CLEAR_CART: `${API_BASE_URL}/cart/clear`,
};
