// components/Avatar.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

interface AvatarProps {
  uri?: string;
  size?: number;
  onPress?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({ uri, size = 40, onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push("/profile");
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[
            styles.avatar,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <Ionicons name="person" size={size * 0.6} color="#666" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  avatar: {
    borderWidth: 1,
    borderColor: "#EEE",
  },
  placeholder: {
    backgroundColor: "#EEE",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDD",
  },
});

export default Avatar;
