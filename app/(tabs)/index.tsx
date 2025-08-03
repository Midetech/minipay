import AddBankAccountModal from "@/components/AddBankAccountModal";
import { Card } from "@/components/Card";
import { addAccount, getAccount } from "@/store/accountThunks";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "../../constants/Colors";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

export default function DashboardScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isFetchingAccounts, isAddingAccount } = useAppSelector(
    (state) => state.user
  );
  const translateX = useRef(new Animated.Value(-250)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const { width: screenWidth } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);

  const toggleMenu = () => {
    const toValue = isMenuOpen ? -250 : 0;
    const overlayToValue = isMenuOpen ? 0 : 0.5;

    Animated.parallel([
      Animated.timing(translateX, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: overlayToValue,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: -250,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setIsMenuOpen(false);
  };
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (user?.id) {
      dispatch(getAccount(user.id));
    }
  }, [user?.id, dispatch]);

  if (!user) {
    return null; // Auto-logout hook will handle redirect
  }

  const handleAddAccount = async (accountData: Omit<BankAccount, "id">) => {
    if (!user?.id) {
      // This should not happen since we show UserNotFoundError when no user
      return;
    }

    try {
      await dispatch(
        addAccount({ userId: user.id, account: accountData })
      ).unwrap();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error adding bank account:", error);
      Alert.alert("Error", "Failed to add bank account. Please try again.");
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View
        style={[styles.container, { backgroundColor: Colors.light.background }]}
      >
        <StatusBar style="dark" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
            <Text style={[styles.menuIcon, { color: Colors.light.text }]}>
              ☰
            </Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: Colors.light.text }]}>
            Dashboard
          </Text>
          <View style={styles.headerRight} />
        </View>

        {/* Overlay Background */}
        {isMenuOpen && (
          <TouchableWithoutFeedback onPress={closeMenu}>
            <Animated.View
              style={[
                styles.overlay,
                {
                  opacity: overlayOpacity,
                },
              ]}
            />
          </TouchableWithoutFeedback>
        )}

        {/* Menu Drawer */}
        <Animated.View
          style={[
            styles.menuDrawer,
            {
              backgroundColor: Colors.light.background,
              transform: [{ translateX }],
            },
          ]}
        >
          <View style={styles.menuContent}>
            <View style={styles.menuHeader}>
              <Text style={[styles.menuTitle, { color: Colors.light.text }]}>
                Menu
              </Text>
              <TouchableOpacity onPress={closeMenu} style={styles.closeButton}>
                <Text style={[styles.closeIcon, { color: Colors.light.text }]}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                router.push("/profile");
                closeMenu();
              }}
            >
              <Text style={[styles.menuItemText, { color: Colors.light.text }]}>
                Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                router.push("/explore");
                closeMenu();
              }}
            >
              <Text style={[styles.menuItemText, { color: Colors.light.text }]}>
                Settings
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                router.push("/explore");
                closeMenu();
              }}
            >
              <Text style={[styles.menuItemText, { color: Colors.light.text }]}>
                Help
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Main Content */}
        <View style={styles.content}>
          <Text style={[styles.welcomeText, { color: Colors.light.text }]}>
            Welcome back, {user.name}!
          </Text>

          {/* Bank Account Card */}
          {isFetchingAccounts ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.light.tint} />
              <Text style={styles.loadingText}>Loading accounts...</Text>
            </View>
          ) : user.bankAccounts.length > 0 ? (
            <View style={styles.cardContainer}>
              <FlatList
                ref={flatListRef}
                data={user.bankAccounts}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <Card currentAccount={item} />}
                pagingEnabled
                snapToInterval={screenWidth - 40}
                snapToAlignment="center"
                decelerationRate="fast"
                onMomentumScrollEnd={(event) => {
                  const index = Math.round(
                    event.nativeEvent.contentOffset.x / (screenWidth - 40)
                  );
                  setCurrentIndex(index);
                }}
                getItemLayout={(data, index) => ({
                  length: screenWidth - 40,
                  offset: (screenWidth - 40) * index,
                  index,
                })}
              />

              <View style={styles.indicators}>
                {user.bankAccounts.map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setCurrentIndex(index);
                      flatListRef.current?.scrollToIndex({
                        index,
                        animated: true,
                      });
                    }}
                    style={[
                      styles.indicator,
                      {
                        backgroundColor:
                          index === currentIndex
                            ? Colors.light.tint
                            : Colors.light.tabIconDefault,
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text
                style={[styles.emptyStateTitle, { color: Colors.light.text }]}
              >
                No Bank Accounts
              </Text>
              <Text
                style={[
                  styles.emptyStateSubtitle,
                  { color: Colors.light.tabIconDefault },
                ]}
              >
                Add your bank accounts to get started
              </Text>

              <TouchableOpacity
                style={styles.addAccountButton}
                onPress={() => setIsModalVisible(true)}
              >
                <Text style={styles.addAccountButtonText}>Add Account</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Action Buttons */}
          {user.bankAccounts.length > 0 && !isFetchingAccounts && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: Colors.light.tint },
                ]}
              >
                <Text style={styles.actionButtonText}>Send Money</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: Colors.light.tint },
                ]}
              >
                <Text style={styles.actionButtonText}>Request Money</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: Colors.light.tint },
                ]}
              >
                <Text style={styles.actionButtonText}>View Transactions</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <AddBankAccountModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAddAccount={handleAddAccount}
        isLoading={isAddingAccount}
        userId={user.id}
        resetForm={() => {}}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  menuButton: {
    padding: 10,
  },
  menuIcon: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerRight: {
    width: 44,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
    zIndex: 999,
  },
  menuDrawer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 250,
    height: "100%",
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuContent: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  menuHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 10,
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: {
    fontSize: 20,
    fontWeight: "bold",
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  menuItemText: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  cardContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    marginBottom: 30,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  indicators: {
    flexDirection: "row",
    marginTop: 20,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  swipeText: {
    marginTop: 10,
    fontSize: 14,
    opacity: 0.6,
  },
  actionButtons: {
    gap: 15,
  },
  actionButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  addAccountButton: {
    backgroundColor: Colors.light.tint,
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  addAccountButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
