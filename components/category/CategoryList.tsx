import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CategoryListProps {
  categories: Array<{
    categoryId: string | number;
    name: string;
    description?: string;
  }>;
  selectedCategory: string | number;
  onSelectCategory: (categoryId: string | number) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.categoryId}
            style={[
              styles.categoryItem,
              selectedCategory === category.categoryId &&
                styles.selectedCategory,
            ]}
            onPress={() => onSelectCategory(category.categoryId)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.categoryName,
                selectedCategory === category.categoryId &&
                  styles.selectedCategoryName,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 8,
    backgroundColor: "#fff",
  },
  container: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: "#EDEDED",
    borderRadius: 25,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedCategory: {
    backgroundColor: "#FF7F33",
  },
  categoryName: {
    color: "#333",
    fontWeight: "600",
    fontSize: 14,
  },
  selectedCategoryName: {
    color: "#fff",
  },
});

export default CategoryList;
