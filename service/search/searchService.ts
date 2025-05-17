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

export interface SearchResponse {
  code: number;
  result: Product[];
}

export const SearchService = {
  searchProducts: async (query: string): Promise<SearchResponse> => {
    const response = await apiClient.get(
      `${ProductEndpoints.SEARCH_PRODUCTS}?name=${query}`
    );
    return response.data;
  },
};
