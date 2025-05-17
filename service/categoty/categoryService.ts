import apiClient from "../apiClient";
import { CategoryEndpoints } from "../../constants/ApiEndpoints";

export interface Category {
  categoryId: number;
  name: string;
  description: string;
  isActive: boolean;
}

export const CategoryService = {
  getAllCategories: async () => {
    const response = await apiClient.get(CategoryEndpoints.GET_ALL_CATEGORIES);
    return response.data;
  },
};
