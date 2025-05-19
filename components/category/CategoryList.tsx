import React from "react";
import {
  Dimensions,
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

const { width } = Dimensions.get("window");
const ITEM_PADDING = 12;
const ITEM_MARGIN = 8;

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
        decelerationRate="fast"
        snapToInterval={width * 0.4} // Snap item width + margin
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.categoryId;

          return (
            <TouchableOpacity
              key={category.categoryId}
              style={[
                styles.categoryItem,
                isSelected && styles.selectedCategory,
                {
                  shadowColor: isSelected ? "#FF7F33" : "#000",
                },
              ]}
              onPress={() => onSelectCategory(category.categoryId)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryName,
                  isSelected && styles.selectedCategoryName,
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {category.name}
              </Text>
              {isSelected && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F0F0F0",
  },
  container: {
    paddingHorizontal: 16,
    alignItems: "center",
  },
  categoryItem: {
    minWidth: width * 0.3,
    paddingHorizontal: ITEM_PADDING,
    paddingVertical: 10,
    backgroundColor: "#F8F8F8",
    borderRadius: 20,
    marginHorizontal: ITEM_MARGIN / 2,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  selectedCategory: {
    backgroundColor: "#FF7F33",
    borderColor: "#FF7F33",
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  categoryName: {
    color: "#555",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  selectedCategoryName: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  activeIndicator: {
    position: "absolute",
    bottom: -8,
    width: 20,
    height: 3,
    backgroundColor: "#FF7F33",
    borderRadius: 2,
  },
});

export default CategoryList;
