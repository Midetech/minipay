import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/Colors";
import { useAppDispatch } from "../store/hooks";
import { setUserName } from "../store/userSlice";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();

  const handleLogin = () => {
    if (username.trim() && password.trim()) {
      dispatch(setUserName(username));
      router.replace("/(tabs)");
    } else {
      Alert.alert("Error", "Please enter both username and password");
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: Colors.light.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="dark" />

      <View style={styles.content}>
        <Text style={[styles.title, { color: Colors.light.text }]}>
          Welcome to MiniPay
        </Text>

        <View style={styles.form}>
          <TextInput
            style={[
              styles.input,
              {
                color: Colors.light.text,
                borderColor: Colors.light.tabIconDefault,
              },
            ]}
            placeholder="Username"
            placeholderTextColor={Colors.light.text}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <TextInput
            style={[
              styles.input,
              {
                color: Colors.light.text,
                borderColor: Colors.light.tabIconDefault,
              },
            ]}
            placeholder="Password"
            placeholderTextColor={Colors.light.text}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: Colors.light.tint }]}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: Colors.light.text }]}>
            Don&apos;t have an account?{" "}
          </Text>
          <TouchableOpacity>
            <Text style={[styles.linkText, { color: Colors.light.tint }]}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },
  form: {
    gap: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: Colors.light.background,
  },
  loginButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
  },
  footerText: {
    fontSize: 16,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
