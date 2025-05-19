import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "../../hooks/useCart";
import { useFavorite } from "../../hooks/useFavorite";
import { ProductService } from "../../service/product/productService";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { isFavorite, toggleFavorite } = useFavorite(Number(id));

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

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setAddingToCart(true);
    try {
      await addToCart(product.productId, quantity);
      Alert.alert("Thành công", `Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      Alert.alert("Lỗi", "Không thể thêm vào giỏ hàng");
    } finally {
      setAddingToCart(false);
    }
  };

  const discountPercentage =
    product?.price > product?.salePrice
      ? Math.round((1 - product.salePrice / product.price) * 100)
      : 0;

  if (loading || !product) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7F33" />
        <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header cố định - Đã xóa nút tim */}
      <SafeAreaView style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Ảnh sản phẩm với nút tim ở góc phải dưới */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
          {discountPercentage > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discountPercentage}%</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={toggleFavorite}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? "#FF3B30" : "#FFF"}
            />
          </TouchableOpacity>
        </View>

        {/* Thông tin sản phẩm */}
        <View style={styles.productInfoContainer}>
          {/* Tên sản phẩm - Lớn */}
          <Text style={styles.productName}>{product.name}</Text>

          {/* Giá sản phẩm - Hiển thị bên dưới tên */}
          <View style={styles.priceContainer}>
            <Text style={styles.salePrice}>
              {product.salePrice.toLocaleString()}đ
            </Text>
            {product.price > product.salePrice && (
              <Text style={styles.originalPrice}>
                {product.price.toLocaleString()}đ
              </Text>
            )}
          </View>

          {/* Đánh giá */}
          {product.rating && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={18} color="#FFC120" />
              <Text style={styles.ratingText}>
                {product.rating.toFixed(1)} ({product.reviewCount || 0} đánh
                giá)
              </Text>
            </View>
          )}
        </View>

        {/* Mô tả sản phẩm */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        {/* Thông tin kho hàng */}
        <View style={styles.stockContainer}>
          <Ionicons name="cube" size={20} color="#666" />
          <Text style={styles.stockText}>
            {product.stock > 0
              ? `Còn ${product.stock} sản phẩm`
              : "Tạm hết hàng"}
          </Text>
        </View>

        {/* Chọn số lượng */}
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Số lượng:</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={[
                styles.quantityButton,
                quantity <= 1 && styles.disabledButton,
              ]}
              onPress={decreaseQuantity}
              disabled={quantity <= 1}
            >
              <Ionicons
                name="remove"
                size={20}
                color={quantity <= 1 ? "#ccc" : "#FF7F33"}
              />
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <TouchableOpacity
              style={[
                styles.quantityButton,
                quantity >= product.stock && styles.disabledButton,
              ]}
              onPress={increaseQuantity}
              disabled={quantity >= product.stock}
            >
              <Ionicons
                name="add"
                size={20}
                color={quantity >= product.stock ? "#ccc" : "#FF7F33"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Nút thêm vào giỏ hàng */}
      <SafeAreaView style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            addingToCart && styles.addToCartButtonDisabled,
            product.stock <= 0 && styles.outOfStockButton,
          ]}
          onPress={handleAddToCart}
          disabled={addingToCart || product.stock <= 0}
        >
          {addingToCart ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addToCartText}>
              {product.stock > 0
                ? "Thêm vào giỏ hàng"
                : "Thông báo khi có hàng"}
            </Text>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    </View>
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
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 8,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  imageContainer: {
    width: "100%",
    height: 350,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  discountBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "#FF3B30",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discountText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  favoriteButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  productInfoContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 16,
  },
  productName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  salePrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FF7F33",
    marginRight: 12,
  },
  originalPrice: {
    fontSize: 18,
    color: "#999",
    textDecorationLine: "line-through",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#eee",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
  stockContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  stockText: {
    marginLeft: 8,
    color: "#666",
    fontSize: 14,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  quantityLabel: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  quantityButton: {
    padding: 10,
    minWidth: 40,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  quantityValue: {
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    minWidth: 30,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#eee",
  },
  addToCartButton: {
    backgroundColor: "#FF7F33",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  addToCartButtonDisabled: {
    backgroundColor: "#FF7F33",
    opacity: 0.7,
  },
  outOfStockButton: {
    backgroundColor: "#999",
  },
  addToCartText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
