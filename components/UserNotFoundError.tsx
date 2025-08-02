import { router } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/Colors";
import { clearUserDataAndLogout } from "../store/authThunks";
import { useAppDispatch } from "../store/hooks";

interface UserNotFoundErrorProps {
  message?: string;
  showSubtitle?: boolean;
}

export default function UserNotFoundError({
  message = "User not found",
  showSubtitle = true,
}: UserNotFoundErrorProps) {
  const dispatch = useAppDispatch();

  const handleClearDataAndLogin = () => {
    Alert.alert(
      "Clear Data & Login",
      "This will clear all saved data and return you to the login screen. Are you sure?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear & Login",
          style: "destructive",
          onPress: async () => {
            try {
              await dispatch(clearUserDataAndLogout()).unwrap();
              router.replace("/login");
            } catch (error) {
              console.error("Error clearing user data:", error);
              Alert.alert("Error", "Failed to clear data. Please try again.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>{message}</Text>
      {showSubtitle && (
        <Text style={styles.subtitleText}>
          Your saved data may be invalid or outdated.
        </Text>
      )}
      <TouchableOpacity
        style={styles.clearButton}
        onPress={handleClearDataAndLogin}
      >
        <Text style={styles.clearButtonText}>Clear Data & Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FF3B30",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitleText: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 20,
  },
  clearButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 200,
  },
  clearButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
