import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Message = {
  id: string;
  text: string;
  sender: "user" | "ai";
  time: string;
};

// Dữ liệu sản phẩm giả
const PRODUCTS = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: "28.990.000đ",
    specs: "Màn hình 6.7inch, Chip A17 Pro, Camera 48MP",
    stock: 15,
  },
  {
    id: 2,
    name: "Samsung Galaxy S23 Ultra",
    price: "23.990.000đ",
    specs: "Màn hình 6.8inch, Snapdragon 8 Gen 2, Bút S-Pen",
    stock: 8,
  },
  {
    id: 3,
    name: "Xiaomi 13 Pro",
    price: "19.990.000đ",
    specs: "Màn hình 6.73inch, Snapdragon 8 Gen 2, Camera Leica",
    stock: 12,
  },
  {
    id: 4,
    name: "OPPO Find X5 Pro",
    price: "18.490.000đ",
    specs: "Màn hình 6.7inch, Snapdragon 8 Gen 1, Camera Hasselblad",
    stock: 5,
  },
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Xin chào! Tôi là trợ lý bán hàng của bạn. Bạn cần tìm điện thoại gì ạ?\n\nGợi ý một số câu hỏi:\n1. Có điện thoại iPhone nào không?\n2. Điện thoại giá rẻ nhất là gì?\n3. Tôi muốn xem Samsung Galaxy",
      sender: "ai",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (inputText.trim() === "") return;

    // Thêm tin nhắn của người dùng
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputText("");

    // Xử lý phản hồi AI dựa trên input
    setTimeout(() => {
      let responseText = "";
      const lowerInput = inputText.toLowerCase();

      if (lowerInput.includes("iphone")) {
        const iphones = PRODUCTS.filter((p) => p.name.includes("iPhone"));
        responseText =
          iphones.length > 0
            ? `Chúng tôi có ${iphones.length} iPhone:\n${iphones
                .map((p) => `- ${p.name}: ${p.price}\n${p.specs}`)
                .join("\n\n")}`
            : "Hiện không có iPhone trong kho";
      } else if (lowerInput.includes("samsung")) {
        const samsungs = PRODUCTS.filter((p) => p.name.includes("Samsung"));
        responseText =
          samsungs.length > 0
            ? `Chúng tôi có ${samsung.length} Samsung:\n${samsungs
                .map((p) => `- ${p.name}: ${p.price}\n${p.specs}`)
                .join("\n\n")}`
            : "Hiện không có Samsung trong kho";
      } else if (
        lowerInput.includes("giá rẻ") ||
        lowerInput.includes("rẻ nhất")
      ) {
        const cheapest = PRODUCTS.reduce((prev, current) =>
          parseInt(prev.price.replace(/\D/g, "")) <
          parseInt(current.price.replace(/\D/g, ""))
            ? prev
            : current
        );
        responseText = `Điện thoại giá rẻ nhất là:\n${cheapest.name}\nGiá: ${cheapest.price}\nThông số: ${cheapest.specs}\nCòn ${cheapest.stock} sản phẩm`;
      } else if (
        lowerInput.includes("còn hàng") ||
        lowerInput.includes("kho")
      ) {
        const availableProducts = PRODUCTS.filter((p) => p.stock > 0);
        responseText = `Hiện có ${
          availableProducts.length
        } sản phẩm còn hàng:\n${availableProducts
          .map((p) => `- ${p.name}: Còn ${p.stock} cái`)
          .join("\n")}`;
      } else {
        responseText = `Chúng tôi có ${
          PRODUCTS.length
        } điện thoại cao cấp:\n${PRODUCTS.map(
          (p) => `- ${p.name}: ${p.price}`
        ).join("\n")}\n\nBạn muốn xem chi tiết sản phẩm nào?`;
      }

      const newAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: "ai",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, newAiMessage]);
    }, 800);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === "user" ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.sender === "user" ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text
          style={
            item.sender === "user" ? styles.userMessageText : styles.messageText
          }
        >
          {item.text}
        </Text>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Nhập câu hỏi về sản phẩm..."
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={inputText.trim() === ""}
        >
          <Ionicons
            name="send"
            size={24}
            color={inputText.trim() === "" ? "#ccc" : "#FF7F33"}
          />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: "flex-end",
  },
  aiMessage: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "85%",
    padding: 12,
    borderRadius: 12,
  },
  userBubble: {
    backgroundColor: "#FF7F33",
    borderTopRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#eee",
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  userMessageText: {
    fontSize: 16,
    color: "#fff",
  },
  timeText: {
    fontSize: 12,
    color: "rgba(0,0,0,0.5)",
    marginTop: 4,
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
    fontSize: 16,
    marginRight: 8,
  },
  sendButton: {
    padding: 8,
  },
});
