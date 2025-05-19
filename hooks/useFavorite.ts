import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const FAVORITES_KEY = "user_favorites";

export const useFavorite = (productId: number) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
        if (favorites) {
          const parsedFavorites = JSON.parse(favorites);
          setIsFavorite(parsedFavorites.includes(productId));
        }
      } catch (error) {
        console.error("Error checking favorite:", error);
      }
    };

    checkFavorite();
  }, [productId]);

  const toggleFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      let newFavorites = [];

      if (favorites) {
        newFavorites = JSON.parse(favorites);
      }

      if (isFavorite) {
        newFavorites = newFavorites.filter((id: number) => id !== productId);
      } else {
        newFavorites.push(productId);
      }

      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return { isFavorite, toggleFavorite };
};
