// app/(tabs)/profile.tsx
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useOrder } from "../../hooks/useOrder";
import { useUser } from "../../hooks/useUser";

const ProfileScreen = () => {
  const { user, clearUser, updateAvatar, loading: userLoading } = useUser();
  const { fetchOrders } = useOrder();
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
  });

  // Load order statistics
  useEffect(() => {
    const loadOrderStats = async () => {
      try {
        const response = await fetchOrders();
        const orders = response.result || [];

        setOrderStats({
          total: orders.length,
          pending: orders.filter((o) => o.status === "PENDING").length,
          completed: orders.filter((o) => o.status === "COMPLETED").length,
          cancelled: orders.filter((o) => o.status === "CANCELLED").length,
        });
      } catch (error) {
        console.error("Error loading order stats:", error);
      }
    };

    loadOrderStats();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Xác nhận đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đăng xuất",
          onPress: async () => {
            try {
              await clearUser();
              router.replace("/(auth)/LoginScreen");
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert("Lỗi", "Đăng xuất không thành công");
            }
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    router.push({
      pathname: "/profile/edit",
      params: {
        phone: user?.phone || "",
        address: user?.address || "",
      },
    });
  };

  const handleAvatarPress = async () => {
    Alert.alert("Cập nhật ảnh đại diện", "Chọn cách cập nhật ảnh đại diện", [
      {
        text: "Chụp ảnh mới",
        onPress: () => handleImagePicker(true),
      },
      {
        text: "Chọn từ thư viện",
        onPress: () => handleImagePicker(false),
      },
      {
        text: "Hủy",
        style: "cancel",
      },
    ]);
  };

  const handleImagePicker = async (useCamera: boolean) => {
    try {
      setAvatarLoading(true);

      const permission = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Quyền truy cập bị từ chối",
          `Bạn cần cấp quyền truy cập ${
            useCamera ? "camera" : "thư viện ảnh"
          } để tiếp tục`
        );
        return;
      }

      const result = await (useCamera
        ? ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          })
        : ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          }));

      if (!result.canceled && result.assets?.[0]?.uri) {
        await updateAvatar(result.assets[0].uri);
        Alert.alert("Thành công", "Ảnh đại diện đã được cập nhật");
      }
    } catch (error: any) {
      console.error("Lỗi khi cập nhật avatar:", error);
      Alert.alert("Lỗi", error.message || "Không thể cập nhật ảnh đại diện");
    } finally {
      setAvatarLoading(false);
    }
  };

  const openSupport = () => {
    Linking.openURL("mailto:support@example.com?subject=Hỗ trợ ứng dụng");
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Phần header với avatar và thông tin */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity
            onPress={handleAvatarPress}
            disabled={avatarLoading}
            activeOpacity={0.7}
          >
            {avatarLoading ? (
              <View style={[styles.avatar, styles.avatarLoading]}>
                <ActivityIndicator size="small" color="#FFF" />
              </View>
            ) : user?.avatar ? (
              <Image
                source={{ uri: `${user.avatar}?${Date.now()}` }}
                style={styles.avatar}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={48} color="#666" />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editIcon}
            onPress={handleEditProfile}
            activeOpacity={0.7}
          >
            <Feather name="edit-2" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.name} numberOfLines={1}>
          {user?.fullName || user?.username || "Khách"}
        </Text>
        <Text style={styles.email} numberOfLines={1}>
          {user?.email || "Chưa có thông tin email"}
        </Text>
      </View>

      {/* Thống kê đơn hàng */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thống kê đơn hàng</Text>

        <View style={styles.statsContainer}>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => router.push("/orders")}
            activeOpacity={0.7}
          >
            <Text style={styles.statNumber}>{orderStats.total}</Text>
            <Text style={styles.statLabel}>Tổng đơn</Text>
          </TouchableOpacity>

          <View style={styles.statDivider} />

          <TouchableOpacity
            style={styles.statItem}
            onPress={() => router.push("/orders?status=PENDING")}
            activeOpacity={0.7}
          >
            <Text style={[styles.statNumber, styles.pendingText]}>
              {orderStats.pending}
            </Text>
            <Text style={styles.statLabel}>Đang xử lý</Text>
          </TouchableOpacity>

          <View style={styles.statDivider} />

          <TouchableOpacity
            style={styles.statItem}
            onPress={() => router.push("/orders?status=COMPLETED")}
            activeOpacity={0.7}
          >
            <Text style={[styles.statNumber, styles.completedText]}>
              {orderStats.completed}
            </Text>
            <Text style={styles.statLabel}>Hoàn thành</Text>
          </TouchableOpacity>

          <View style={styles.statDivider} />

          <TouchableOpacity
            style={styles.statItem}
            onPress={() => router.push("/orders?status=CANCELLED")}
            activeOpacity={0.7}
          >
            <Text style={[styles.statNumber, styles.cancelledText]}>
              {orderStats.cancelled}
            </Text>
            <Text style={styles.statLabel}>Đã hủy</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Thông tin cá nhân */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>

        {user?.phone && (
          <TouchableOpacity style={styles.infoItem} activeOpacity={0.7}>
            <Ionicons name="call-outline" size={20} color="#666" />
            <Text style={styles.infoText} numberOfLines={1}>
              {user.phone}
            </Text>
          </TouchableOpacity>
        )}

        {user?.address && (
          <TouchableOpacity
            style={styles.infoItem}
            activeOpacity={0.7}
            onPress={() => router.push("/addresses")}
          >
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.infoText} numberOfLines={2}>
              {user.address}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.editInfoButton}
          onPress={handleEditProfile}
          activeOpacity={0.7}
        >
          <Feather name="edit-2" size={16} color="#FF7F33" />
          <Text style={styles.editInfoText}>Chỉnh sửa thông tin</Text>
        </TouchableOpacity>
      </View>

      {/* Menu chức năng */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tài khoản & Đơn hàng</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/orders")}
          activeOpacity={0.7}
        >
          <View style={styles.menuIcon}>
            <MaterialIcons name="history" size={24} color="#FF7F33" />
          </View>
          <Text style={styles.menuText}>Lịch sử đơn hàng</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/wishlist")}
          activeOpacity={0.7}
        >
          <View style={styles.menuIcon}>
            <Ionicons name="heart-outline" size={24} color="#FF7F33" />
          </View>
          <Text style={styles.menuText}>Sản phẩm yêu thích</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/addresses")}
          activeOpacity={0.7}
        >
          <View style={styles.menuIcon}>
            <Ionicons name="location-outline" size={24} color="#FF7F33" />
          </View>
          <Text style={styles.menuText}>Địa chỉ giao hàng</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Menu cài đặt và hỗ trợ */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cài đặt & Hỗ trợ</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/settings")}
          activeOpacity={0.7}
        >
          <View style={styles.menuIcon}>
            <Ionicons name="settings-outline" size={24} color="#FF7F33" />
          </View>
          <Text style={styles.menuText}>Cài đặt tài khoản</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={openSupport}
          activeOpacity={0.7}
        >
          <View style={styles.menuIcon}>
            <Ionicons name="help-circle-outline" size={24} color="#FF7F33" />
          </View>
          <Text style={styles.menuText}>Trợ giúp & Hỗ trợ</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/notifications")}
          activeOpacity={0.7}
        >
          <View style={styles.menuIcon}>
            <Ionicons name="notifications-outline" size={24} color="#FF7F33" />
          </View>
          <Text style={styles.menuText}>Thông báo</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Nút đăng xuất */}
      <TouchableOpacity
        style={[styles.logoutButton, userLoading && styles.disabledButton]}
        onPress={handleLogout}
        disabled={userLoading}
        activeOpacity={0.7}
      >
        {userLoading ? (
          <ActivityIndicator color="#FF7F33" />
        ) : (
          <>
            <Ionicons name="log-out-outline" size={20} color="#FF7F33" />
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Thông tin phiên bản */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
        <Text style={styles.copyrightText}>© 2023 Công ty của bạn</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "#FFF",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarLoading: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 127, 51, 0.7)",
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#EEE",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FF7F33",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
    textAlign: "center",
    maxWidth: "90%",
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
    textAlign: "center",
    maxWidth: "90%",
  },
  section: {
    backgroundColor: "#FFF",
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    backgroundColor: "#FAFAFA",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF7F33",
    marginBottom: 4,
  },
  pendingText: {
    color: "#FFA000",
  },
  completedText: {
    color: "#4CAF50",
  },
  cancelledText: {
    color: "#F44336",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#EEE",
    marginVertical: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 12,
    flex: 1,
  },
  editInfoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  editInfoText: {
    color: "#FF7F33",
    fontSize: 14,
    marginLeft: 8,
    fontWeight: "500",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  menuIcon: {
    width: 32,
    alignItems: "center",
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF7F33",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  disabledButton: {
    opacity: 0.6,
  },
  logoutText: {
    color: "#FF7F33",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  versionContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  versionText: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    color: "#999",
  },
});

export default ProfileScreen;
