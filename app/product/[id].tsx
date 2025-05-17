import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "../../hooks/useCart";
import { ProductService } from "../../service/product/productService";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  // Sử dụng hook useCart để lấy hàm addToCart
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await ProductService.getProductById(Number(id));
        setProduct(response.result);
      } catch (error) {
        console.error("Error fetching product:", error);
        Alert.alert("Lỗi", "Không thể tải thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Hàm xử lý thêm vào giỏ hàng
  const handleAddToCart = async () => {
    if (!product) return;

    setAddingToCart(true);
    try {
      await addToCart(product.productId);
      Alert.alert("Thành công", "Sản phẩm đã được thêm vào giỏ hàng");
    } catch (error) {
      console.error("Error adding to cart:", error);
      Alert.alert("Lỗi", "Không thể thêm vào giỏ hàng");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading || !product) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7F33" />
        <Text style={{ marginTop: 10 }}>Đang tải sản phẩm...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />

      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{product.name}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.salePrice}>
            {product.salePrice.toLocaleString()}đ
          </Text>
          <Text style={styles.originalPrice}>
            {product.price.toLocaleString()}đ
          </Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {Math.round((1 - product.salePrice / product.price) * 100)}%
            </Text>
          </View>
        </View>

        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.stockContainer}>
          <Ionicons name="cube" size={20} color="#666" />
          <Text style={styles.stockText}>Còn {product.stock} sản phẩm</Text>
        </View>

        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
          disabled={addingToCart}
        >
          {addingToCart ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  detailsContainer: {
    padding: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  salePrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF7F33",
    marginRight: 12,
  },
  originalPrice: {
    fontSize: 16,
    color: "#999",
    textDecorationLine: "line-through",
    marginRight: 12,
  },
  discountBadge: {
    backgroundColor: "#FF7F33",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 20,
  },
  stockContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  stockText: {
    marginLeft: 8,
    color: "#666",
  },
  addToCartButton: {
    backgroundColor: "#FF7F33",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    opacity: 1,
  },
  addToCartButtonDisabled: {
    opacity: 0.6,
  },
  addToCartText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
