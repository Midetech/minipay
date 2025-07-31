import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/constants/Colors";

type Props = {
  title: string;
  children: React.ReactNode;
};

export function Collapsible({ title, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.8}
      >
        <Text style={[styles.title, { color: Colors.light.text }]}>
          {title}
        </Text>
        <Text style={[styles.chevron, { color: Colors.light.text }]}>
          {isOpen ? "▼" : "▶"}
        </Text>
      </TouchableOpacity>
      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  chevron: {
    fontSize: 12,
  },
  content: {
    padding: 16,
    backgroundColor: Colors.light.background,
  },
});
