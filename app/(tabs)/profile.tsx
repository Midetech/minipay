import { router } from "expo-router";
import React from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/Colors";
import {
  disableBiometric,
  enableBiometric,
  getUserById,
  logoutUser,
} from "../../store/authThunks";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

export default function ProfileScreen() {
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
  console.log("isBiometricEnabled", isBiometricEnabled);
  const handleEnableBiometric = async () => {
    if (!user?.username) {
      Alert.alert(
        "Error",
        "Please login first to enable biometric authentication"
      );
      return;
    }

    try {
      const { password } = await dispatch(getUserById(user.id)).unwrap();

      if (password) {
        const result = await dispatch(enableBiometric()).unwrap();
        console.log(result);
        Alert.alert(
          "Success",
          "Biometric authentication enabled successfully!"
        );
      } else {
        Alert.alert(
          "Error",
          "Please login first to enable biometric authentication"
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to enable biometric"
      );
    }
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
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: isBiometricEnabled ? "#34C759" : "#FF3B30",
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    if (isBiometricEnabled) {
                      dispatch(disableBiometric());
                    } else {
                      handleEnableBiometric();
                    }
                  }}
                  // disabled={isLoading}
                >
                  <Text style={styles.statusText}>
                    {isBiometricEnabled ? "Enabled" : "Disabled"}
                  </Text>
                </TouchableOpacity>
              </View>
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
