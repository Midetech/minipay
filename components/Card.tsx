import { Colors } from "@/constants/Colors";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BankAccount } from "../store/userSlice";

const { width: screenWidth } = Dimensions.get("window");

export const Card = ({ currentAccount }: { currentAccount: BankAccount }) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "checking":
        return "#007AFF";
      case "savings":
        return "#34C759";
      case "credit":
        return "#FF9500";
      default:
        return Colors.light.tint;
    }
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: getAccountTypeColor(currentAccount.accountType) },
      ]}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{currentAccount.bankName}</Text>
        <View style={styles.accountTypeBadge}>
          <Text style={styles.accountTypeText}>
            {currentAccount.accountType.charAt(0).toUpperCase() +
              currentAccount.accountType.slice(1)}
          </Text>
        </View>
      </View>

      <Text style={styles.accountNumber}>
        ****{currentAccount.accountNumber.slice(-4)}
      </Text>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balance}>
          {formatCurrency(currentAccount.balance, currentAccount.currency)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: screenWidth - 40,
    height: 200,
    borderRadius: 15,
    padding: 20,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
  accountTypeBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  accountTypeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  accountNumber: {
    color: "white",
    fontSize: 16,
    opacity: 0.8,
  },
  balanceContainer: {
    marginTop: "auto",
  },
  balanceLabel: {
    color: "white",
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 5,
  },
  balance: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
});
