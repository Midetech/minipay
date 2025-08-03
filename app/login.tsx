import * as LocalAuthentication from "expo-local-authentication";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BiometricSetupModal from "../components/BiometricSetupModal";
import { Colors } from "../constants/Colors";
import { storageService } from "../services/api";
import { biometricLogin, loginUser, registerUser } from "../store/authThunks";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export default function LoginScreen() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [returningUser, setReturningUser] = useState<{
    username: string;
  } | null>(null);

  const dispatch = useAppDispatch();
  const { isLoading, error, isLoggedIn, user } = useAppSelector(
    (state) => state.user
  );

  // Debug logging for login state changes
  useEffect(() => {
    console.log("Login screen - state changed:", {
      isLoggedIn,
      user: user?.username,
      error,
      isBiometricSupported,
      biometricEnabled,
    });
  }, [isLoggedIn, user, error, isBiometricSupported, biometricEnabled]);

  useEffect(() => {
    const checkBiometricSupport = async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricSupported(hasHardware && isEnrolled);
    };

    const checkReturningUser = async () => {
      try {
        const savedUserData = await storageService.getUserData();
        const biometricEnabled = await storageService.getBiometricEnabled();

        if (savedUserData && savedUserData.name) {
          setReturningUser({ username: savedUserData.name });
          setUsername(savedUserData.username);
          setBiometricEnabled(biometricEnabled);
        }
      } catch (error) {
        console.error("Error checking returning user:", error);
      }
    };

    checkBiometricSupport();
    checkReturningUser();
  }, []);

  // Update biometric enabled state when it changes in Redux store
  useEffect(() => {
    const checkBiometricState = async () => {
      const biometricEnabled = await storageService.getBiometricEnabled();
      setBiometricEnabled(biometricEnabled);
    };

    checkBiometricState();
  }, [isLoggedIn]);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }

    try {
      console.log("Attempting login...");
      await dispatch(
        loginUser({ username: username.trim(), password })
      ).unwrap();

      // Clear returning user state when logging in with new credentials
      setReturningUser(null);

      // After successful login, show biometric setup modal if supported and not already enabled
      console.log("Login successful, checking biometric setup:", {
        isBiometricSupported,
        biometricEnabled,
        shouldShowModal: isBiometricSupported && !biometricEnabled,
      });

      if (isBiometricSupported && !biometricEnabled) {
        console.log("Showing biometric setup modal");
        setShowBiometricModal(true);
      }
    } catch (error) {
      console.log("Login error:", error);
      Alert.alert("Error", "Invalid username or password");
    }
  };

  const handleRegister = async () => {
    if (!name.trim() || !username.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    try {
      await dispatch(
        registerUser({
          name: name.trim(),
          username: username.trim(),
          password,
        })
      ).unwrap();

      // Clear returning user state when registering
      setReturningUser(null);

      // After successful registration, show biometric setup modal if supported
      if (isBiometricSupported) {
        setShowBiometricModal(true);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Registration failed. Please try again.");
    }
  };

  const handleBiometricLogin = async () => {
    try {
      console.log("Attempting biometric login...");
      await dispatch(biometricLogin()).unwrap();
      console.log("Biometric login successful");

      // Clear returning user state when logging in with biometric
      setReturningUser(null);
    } catch (error) {
      console.log("Biometric login error:", error);
      Alert.alert(
        "Error",
        "Biometric authentication failed. Please try again."
      );
    }
  };

  const handleBiometricSuccess = () => {
    setBiometricEnabled(true);
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    // Clear form when switching modes
    setName("");
    setUsername("");
    setPassword("");
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: Colors.light.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="dark" />

      <View style={styles.content}>
        <Text style={[styles.title, { color: Colors.light.text }]}>
          {returningUser
            ? `Welcome back, ${returningUser.username}!`
            : isRegisterMode
            ? "Create Account"
            : "Welcome to MiniPay"}
        </Text>

        {returningUser && !isRegisterMode && (
          <Text style={[styles.greeting, { color: Colors.light.text }]}>
            We&apos;re glad to see you again
          </Text>
        )}

        <View style={styles.form}>
          {isRegisterMode && (
            <TextInput
              style={[
                styles.input,
                {
                  color: Colors.light.text,
                  borderColor: Colors.light.tabIconDefault,
                },
              ]}
              placeholder="Full Name"
              placeholderTextColor={Colors.light.text}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              editable={!isLoading}
            />
          )}

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
            editable={!isLoading}
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
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[
              styles.loginButton,
              {
                backgroundColor: isLoading
                  ? Colors.light.tabIconDefault
                  : Colors.light.tint,
                opacity: isLoading ? 0.7 : 1,
              },
            ]}
            onPress={isRegisterMode ? handleRegister : handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.loginButtonText}>
                {isRegisterMode ? "Create Account" : "Login"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Show biometric login option only for supported devices and users who haven't enabled it */}
        {!isRegisterMode && isBiometricSupported && !biometricEnabled && (
          <TouchableOpacity
            style={[
              styles.biometricButton,
              {
                backgroundColor: Colors.light.background,
                borderColor: Colors.light.tint,
                borderWidth: 1,
              },
            ]}
            onPress={handleBiometricLogin}
            disabled={isLoading}
          >
            <Text
              style={[styles.biometricButtonText, { color: Colors.light.tint }]}
            >
              Login with Biometric
            </Text>
          </TouchableOpacity>
        )}

        {/* Show biometric login option for users who have enabled it */}
        {!isRegisterMode && isBiometricSupported && biometricEnabled && (
          <TouchableOpacity
            style={[
              styles.loginButton,
              {
                backgroundColor: isLoading
                  ? Colors.light.tabIconDefault
                  : Colors.light.tint,
                opacity: isLoading ? 0.7 : 1,
              },
            ]}
            onPress={handleBiometricLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>Login with Biometric</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.switchModeButton}
          onPress={toggleMode}
          disabled={isLoading}
        >
          <Text style={[styles.switchModeText, { color: Colors.light.tint }]}>
            {isRegisterMode
              ? "Already have an account? Login"
              : "Don't have an account? Create one"}
          </Text>
        </TouchableOpacity>
      </View>

      <BiometricSetupModal
        visible={showBiometricModal}
        onClose={() => setShowBiometricModal(false)}
        onSuccess={handleBiometricSuccess}
        password={password}
      />
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
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },
  greeting: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
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
  biometricButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  biometricButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  switchModeButton: {
    marginTop: 20,
    paddingVertical: 10,
  },
  switchModeText: {
    fontSize: 16,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  footer: {
    marginTop: 40,
  },
  footerText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
