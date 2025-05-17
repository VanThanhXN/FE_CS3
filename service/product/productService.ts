import { ProductEndpoints } from "../../constants/ApiEndpoints";
import apiClient from "../apiClient";

export interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  salePrice: number;
  stock: number;
  imageUrl: string;
  rating: number | null;
  categoryName: string;
}

export interface ProductSearchResponse {
  code: number;
  result: Product[];
}

export interface ProductResponse {
  code: number;
  result:
    | Product
    | Product[]
    | {
        content: Product[];
        totalPages: number;
        totalElements: number;
        pageable: {
          pageNumber: number;
          pageSize: number;
        };
      };
}

export const ProductService = {
  getAllProducts: async (
    page: number = 0,
    size: number = 10
  ): Promise<ProductResponse> => {
    const response = await apiClient.get(
      `${ProductEndpoints.GET_ALL_PRODUCTS}?page=${page}&size=${size}`
    );
    return response.data;
  },

  getProductById: async (id: number): Promise<ProductResponse> => {
    const response = await apiClient.get(
      ProductEndpoints.GET_PRODUCT_BY_ID(id)
    );
    return response.data;
  },

  getProductsByCategory: async (
    categoryId: number
  ): Promise<ProductResponse> => {
    const response = await apiClient.get(
      ProductEndpoints.GET_PRODUCTS_BY_CATEGORY(categoryId)
    );
    return response.data;
  },

  searchProducts: async (query: string): Promise<ProductResponse> => {
    const response = await apiClient.get(
      `${ProductEndpoints.SEARCH_PRODUCTS}?name=${query}`
    );
    return response.data;
  },
};
