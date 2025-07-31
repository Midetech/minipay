import { Card } from "@/components/Card";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
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
import { logout } from "../../store/userSlice";

// Mock bank accounts data
const bankAccounts = [
  {
    id: "1",
    name: "Chase Bank",
    accountNumber: "****1234",
    balance: 2547.89,
    type: "Checking",
  },
  {
    id: "2",
    name: "Wells Fargo",
    accountNumber: "****5678",
    balance: 18923.45,
    type: "Savings",
  },
  {
    id: "3",
    name: "Bank of America",
    accountNumber: "****9012",
    balance: 5432.1,
    type: "Checking",
  },
];

export default function DashboardScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const translateX = useRef(new Animated.Value(-250)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const { width: screenWidth } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/login");
  };

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
    console.log("closeMenu called, isMenuOpen:", isMenuOpen);
    if (isMenuOpen) {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -250,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      setIsMenuOpen(false);
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
          <TouchableWithoutFeedback onPress={toggleMenu}>
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
        {isMenuOpen && (
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
                <TouchableOpacity
                  onPress={toggleMenu}
                  style={styles.closeButton}
                >
                  <Text
                    style={[styles.closeIcon, { color: Colors.light.text }]}
                  >
                    ✕
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.menuItem}>
                <Text
                  style={[styles.menuItemText, { color: Colors.light.text }]}
                >
                  Profile
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Text
                  style={[styles.menuItemText, { color: Colors.light.text }]}
                >
                  Settings
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Text
                  style={[styles.menuItemText, { color: Colors.light.text }]}
                >
                  Help
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <Text style={[styles.menuItemText, { color: "#ff4444" }]}>
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
        {/* Main Content */}
        <View style={styles.content}>
          <Text style={[styles.welcomeText, { color: Colors.light.text }]}>
            Welcome back, {user.name}!
          </Text>

          {/* Bank Account Card */}
          <View style={styles.cardContainer}>
            <FlatList
              ref={flatListRef}
              data={bankAccounts}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <Card currentAccount={item} />}
              pagingEnabled
              snapToInterval={screenWidth - 40}
              snapToAlignment="center"
              decelerationRate="fast"
              // contentContainerStyle={{ paddingHorizontal: 20 }}
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
              {bankAccounts.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setCurrentIndex(index);
                    // Scroll to the specific card
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

            {/* Swipe Instructions */}
            <Text style={[styles.swipeText, { color: Colors.light.text }]}>
              Swipe left/right to view different accounts
            </Text>
          </View>

          {/* Action Buttons */}
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
        </View>
      </View>
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
});
