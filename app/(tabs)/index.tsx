import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import CategoryList from "../../components/category/CategoryList";
import Header from "../../components/Header";
import ProductCard from "../../components/product/ProductCard";
import { useCart } from "../../hooks/useCart";
import { CategoryService } from "../../service/categoty/categoryService";
import { ProductService } from "../../service/product/productService";
import { SearchService } from "../../service/search/searchService";

export default function HomeScreen() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const { cart } = useCart();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [selectedCategory, page]);

  const fetchCategories = async () => {
    try {
      const response = await CategoryService.getAllCategories();
      setCategories([
        { categoryId: "all", name: "Tất cả" },
        ...response.result,
      ]);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let response;

      if (selectedCategory === "all") {
        response = await ProductService.getAllProducts(page, 10);
        setProducts(
          page === 0
            ? response.result.content
            : [...products, ...response.result.content]
        );
        setTotalPages(response.result.totalPages);
      } else {
        response = await ProductService.getProductsByCategory(
          Number(selectedCategory)
        );
        setProducts(response.result);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        setIsSearching(true);
        const response = await SearchService.searchProducts(query);
        setSearchResults(response.result);
      } catch (error) {
        console.error("Error searching products:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setPage(0);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleLoadMore = () => {
    if (selectedCategory === "all" && page < totalPages - 1 && !searchQuery) {
      setPage(page + 1);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(0);
    fetchProducts();
  };

  const renderFooter = () => {
    if (
      selectedCategory !== "all" ||
      loading ||
      page >= totalPages - 1 ||
      searchQuery
    )
      return null;
    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator size="small" color="#FF7F33" />
      </View>
    );
  };

  const renderEmptyComponent = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {searchQuery
            ? "Không tìm thấy sản phẩm phù hợp"
            : "Không có sản phẩm nào"}
        </Text>
      </View>
    );
  };

  const currentData = searchQuery ? searchResults : products;
  const showCategoryList = !searchQuery;

  if (loading && page === 0 && !isSearching) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7F33" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Trang chủ"
        showBackButton={false}
        showSearch={true}
        cartCount={cart?.totalItems || 0}
        onSearch={handleSearch}
        searchQuery={searchQuery}
      />

      <SafeAreaView style={styles.content}>
        {showCategoryList && (
          <>
            <Text style={styles.sectionTitle}>Danh mục sản phẩm</Text>
            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />
          </>
        )}

        <Text style={styles.sectionTitle}>
          {searchQuery
            ? `Kết quả tìm kiếm cho "${searchQuery}"`
            : selectedCategory === "all"
            ? "Sản phẩm nổi bật"
            : categories.find((c) => c.categoryId === selectedCategory)?.name}
        </Text>

        {isSearching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF7F33" />
          </View>
        ) : (
          <FlatList
            data={currentData}
            renderItem={({ item }) => <ProductCard product={item} />}
            keyExtractor={(item) => item.productId.toString()}
            numColumns={2}
            contentContainerStyle={styles.productsContainer}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmptyComponent}
            refreshControl={
              !searchQuery ? (
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={["#FF7F33"]}
                  tintColor="#FF7F33"
                />
              ) : undefined
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingMore: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    color: "#333",
  },
  productsContainer: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
