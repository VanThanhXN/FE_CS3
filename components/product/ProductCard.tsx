import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Product } from "../../service/product/productService";

interface ProductCardProps {
  product: Product;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 24; // 2 cards per row with 16px padding
const IMAGE_HEIGHT = CARD_WIDTH * 0.9; // Giữ tỉ lệ ảnh vuông

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discountPercentage = Math.round(
    ((product.price - product.salePrice) / product.price) * 100
  );

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/product/${product.productId}`)}
    >
      {/* Image container */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Product info */}
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.priceContainer}>
          <View style={styles.priceWrapper}>
            <Text style={styles.salePrice}>
              {product.salePrice.toLocaleString()}đ
            </Text>
            {discountPercentage > 0 && (
              <Text style={styles.discountText}>-{discountPercentage}%</Text>
            )}
          </View>

          {product.price > product.salePrice && (
            <Text style={styles.originalPrice}>
              {product.price.toLocaleString()}đ
            </Text>
          )}
        </View>

        {/* Rating */}
        {product.rating && (
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFC120" />
            <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#FFF",
    borderRadius: 10,
    margin: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: IMAGE_HEIGHT,
    backgroundColor: "#F5F5F5",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    padding: 12,
  },
  name: {
    fontSize: 16, // Tăng kích thước chữ
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    height: 44, // Tăng chiều cao cho 2 dòng
    lineHeight: 20,
  },
  priceContainer: {
    marginBottom: 8,
  },
  priceWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  salePrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF7F33",
    marginRight: 8,
  },
  discountText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FF3B30",
    backgroundColor: "#FFEBEE",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  originalPrice: {
    fontSize: 13,
    color: "#999",
    textDecorationLine: "line-through",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    color: "#FF7F33",
    marginLeft: 4,
    fontWeight: "500",
  },
});

export default ProductCard;
