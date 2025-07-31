import { Colors } from "@/constants/Colors";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
const { width: screenWidth } = Dimensions.get("window");
export const Card = ({
  currentAccount,
}: {
  currentAccount: {
    name: string;
    accountNumber: string;
    type: string;
    balance: number;
  };
}) => {
  return (
    <View style={[styles.card, { backgroundColor: Colors.light.tint }]}>
      <Text style={styles.cardTitle}>{currentAccount.name}</Text>
      <Text style={styles.accountNumber}>{currentAccount.accountNumber}</Text>
      <Text style={styles.accountType}>{currentAccount.type}</Text>
      <Text style={styles.balance}>
        ${currentAccount.balance.toLocaleString()}
      </Text>
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
  cardTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  accountNumber: {
    color: "white",
    fontSize: 16,
    opacity: 0.8,
  },
  accountType: {
    color: "white",
    fontSize: 14,
    opacity: 0.6,
  },
  balance: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
});
