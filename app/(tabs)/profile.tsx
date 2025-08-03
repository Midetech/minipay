import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BiometricSetupModal from "../../components/BiometricSetupModal";
import { Colors } from "../../constants/Colors";
import { storageService } from "../../services/api";
import { disableBiometric, logoutUser } from "../../store/authThunks";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

export default function ProfileScreen() {
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const { user, isBiometricEnabled } = useAppSelector((state) => state.user);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          dispatch(logoutUser());
          router.replace("/login");
        },
      },
    ]);
  };

  const handleEnableBiometric = async () => {
    try {
      const savedPassword = await storageService.getPassword();
      if (savedPassword) {
        setShowBiometricModal(true);
      } else {
        Alert.alert(
          "No Password Found",
          "Please login with your password first to enable biometric authentication."
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to check saved password. Please login again."
      );
    }
  };

  const handleDisableBiometric = async () => {
    Alert.alert(
      "Disable Biometric Login",
      "Are you sure you want to disable biometric authentication? You'll need to use your password for future logins.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Disable",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              await dispatch(disableBiometric()).unwrap();
              Alert.alert(
                "Success",
                "Biometric authentication has been disabled."
              );
            } catch (error) {
              Alert.alert(
                "Error",
                "Failed to disable biometric authentication."
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleBiometricSuccess = () => {
    // The modal will handle the success state
  };

  if (!user) {
    return null; // Auto-logout hook will handle redirect
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{user.name}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Username</Text>
              <Text style={styles.infoValue}>{user.username}</Text>
            </View>

            {user.email && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Biometric Login</Text>
              <TouchableOpacity
                onPress={
                  isBiometricEnabled
                    ? handleDisableBiometric
                    : handleEnableBiometric
                }
                disabled={isLoading}
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: isBiometricEnabled ? "#34C759" : "#FF3B30",
                    opacity: isLoading ? 0.7 : 1,
                  },
                ]}
              >
                <Text style={styles.statusText}>
                  {isBiometricEnabled ? "Enabled" : "Disabled"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Bank Accounts</Text>
              <Text style={styles.infoValue}>{user.bankAccounts.length}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>

          <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
            <Text style={styles.actionButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>MiniPay v1.0.0</Text>
        </View>
      </ScrollView>

      <BiometricSetupModal
        visible={showBiometricModal}
        onClose={() => setShowBiometricModal(false)}
        onSuccess={handleBiometricSuccess}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  section: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 15,
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  infoLabel: {
    fontSize: 16,
    color: Colors.light.tabIconDefault,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  actionButton: {
    backgroundColor: "#FF3B30",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 50,
  },
  secondaryButton: {
    height: 20,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
