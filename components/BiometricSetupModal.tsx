import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/Colors";
import { storageService } from "../services/api";
import { enableBiometric } from "../store/authThunks";
import { useAppDispatch } from "../store/hooks";

interface BiometricSetupModalProps {
  visible: boolean;
  onClose: () => void;
  password?: string;
  onSuccess?: () => void;
}

export default function BiometricSetupModal({
  visible,
  onClose,
  password = "",
  onSuccess,
}: BiometricSetupModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleEnableBiometric = async () => {
    console.log("BiometricSetupModal: handleEnableBiometric called");
    setIsLoading(true);
    try {
      let passwordToUse = password;

      console.log("BiometricSetupModal: password provided:", !!passwordToUse);

      // If no password provided, try to get it from storage
      if (!passwordToUse) {
        const savedPassword = await storageService.getPassword();
        console.log(
          "BiometricSetupModal: saved password found:",
          !!savedPassword
        );
        if (!savedPassword) {
          Alert.alert(
            "Error",
            "No password found. Please login with your password first."
          );
          setIsLoading(false);
          return;
        }
        passwordToUse = savedPassword;
      }

      console.log("BiometricSetupModal: attempting to enable biometric");
      const result = await dispatch(enableBiometric(passwordToUse)).unwrap();
      console.log("BiometricSetupModal: enableBiometric result:", result);

      if (result) {
        Alert.alert(
          "Biometric Enabled",
          "You can now use biometric authentication for future logins.",
          [
            {
              text: "OK",
              onPress: () => {
                console.log(
                  "BiometricSetupModal: biometric enabled successfully"
                );
                onSuccess?.();
                onClose();
              },
            },
          ]
        );
      }
    } catch (error) {
      console.log("BiometricSetupModal: error enabling biometric:", error);
      Alert.alert("Error", "Failed to enable biometric authentication");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[styles.modal, { backgroundColor: Colors.light.background }]}
        >
          <Text style={[styles.title, { color: Colors.light.text }]}>
            Enable Biometric Login
          </Text>

          <Text style={[styles.description, { color: Colors.light.text }]}>
            Use your fingerprint or face ID for faster and more secure login in
            the future.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                {
                  backgroundColor: isLoading
                    ? Colors.light.tabIconDefault
                    : Colors.light.tint,
                  opacity: isLoading ? 0.7 : 1,
                },
              ]}
              onPress={handleEnableBiometric}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.primaryButtonText}>Enable Biometric</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.secondaryButton,
                {
                  borderColor: Colors.light.tint,
                },
              ]}
              onPress={handleSkip}
              disabled={isLoading}
            >
              <Text
                style={[
                  styles.secondaryButtonText,
                  { color: Colors.light.tint },
                ]}
              >
                Skip for Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "85%",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  primaryButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
