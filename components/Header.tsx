import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showCart?: boolean;
  showSearch?: boolean;
  showAvatar?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title = "",
  showBackButton = false,
  showCart = true,
  showSearch = true,
  showAvatar = true,
}) => {
  const navigation = useNavigation();
  const { cart } = useCart();
  const { user } = useAuth();
  const [searchVisible, setSearchVisible] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const primaryColor = "#FF7F33";
  const backgroundColor = "#FFFFFF";
  const textColor = "#333333";

  const handleSearchPress = () => {
    if (searchVisible && localSearchQuery.trim()) {
      handleSearchSubmit();
    } else {
      setSearchVisible(!searchVisible);
    }
  };

  const handleSearchSubmit = () => {
    if (localSearchQuery.trim()) {
      navigation.navigate("SearchResults", { query: localSearchQuery.trim() });
      setSearchVisible(false);
      setLocalSearchQuery("");
    }
  };

  const handleCartPress = () => {
    navigation.navigate("Cart");
  };

  const handleProfilePress = () => {
    navigation.navigate("Profile");
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.leftSection}>
        {showBackButton ? (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            testID="back-button"
          >
            <Ionicons name="arrow-back" size={24} color={primaryColor} />
          </TouchableOpacity>
        ) : showAvatar && user ? (
          <TouchableOpacity onPress={handleProfilePress}>
            <Image
              source={{
                uri: user.avatarUrl || "https://i.imgur.com/TbWI8VX.png",
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      <View style={styles.centerSection}>
        {searchVisible ? (
          <TextInput
            style={styles.searchInput}
            value={localSearchQuery}
            onChangeText={setLocalSearchQuery}
            placeholder="Tìm kiếm sản phẩm..."
            placeholderTextColor="#999"
            autoFocus
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
        ) : (
          <Text
            style={[styles.title, { color: textColor }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
        )}
      </View>

      <View style={styles.rightSection}>
        {showSearch && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleSearchPress}
            testID="search-button"
          >
            <Ionicons
              name={searchVisible ? "checkmark" : "search"}
              size={24}
              color={primaryColor}
            />
          </TouchableOpacity>
        )}

        {showCart && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleCartPress}
            testID="cart-button"
          >
            <Ionicons name="cart" size={24} color={primaryColor} />
            {cart.totalItems > 0 && (
              <View
                style={[styles.cartBadge, { backgroundColor: primaryColor }]}
              >
                <Text style={styles.cartBadgeText}>
                  {cart.totalItems > 9 ? "9+" : cart.totalItems}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E0E0E0",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  leftSection: {
    width: 40,
    alignItems: "flex-start",
  },
  centerSection: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  rightSection: {
    width: 80,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    maxWidth: "80%",
  },
  searchInput: {
    flex: 1,
    width: "100%",
    height: 36,
    backgroundColor: "#F5F5F5",
    borderRadius: 18,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333",
    ...Platform.select({
      ios: {
        paddingVertical: 8,
      },
      android: {
        paddingVertical: 4,
      },
    }),
  },
  backButton: {
    padding: 4,
  },
  iconButton: {
    padding: 6,
    marginLeft: 8,
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  placeholder: {
    width: 32,
    height: 32,
  },
});

export default Header;
