import { addAccount, getAccount } from "@/store/accountThunks";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AddBankAccountModal from "../../components/AddBankAccountModal";
import { Colors } from "../../constants/Colors";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { BankAccount } from "../../store/userSlice";

export default function BankAccountsScreen() {
  const { user, isAddingAccount, isFetchingAccounts } = useAppSelector(
    (state) => state.user
  );
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Fetch bank accounts when component mounts
  useEffect(() => {
    if (user?.id) {
      dispatch(getAccount(user.id));
    }
  }, [user?.id, dispatch]);

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

  const getAccountTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

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

  const renderBankAccount = ({ item }: { item: BankAccount }) => (
    <View style={styles.accountCard}>
      <View style={styles.accountHeader}>
        <View style={styles.bankInfo}>
          <Text style={styles.bankName}>{item.bankName}</Text>
          <Text style={styles.accountNumber}>
            ****{item.accountNumber.slice(-4)}
          </Text>
        </View>
        <View
          style={[
            styles.accountTypeBadge,
            { backgroundColor: getAccountTypeColor(item.accountType) },
          ]}
        >
          <Text style={styles.accountTypeText}>
            {getAccountTypeLabel(item.accountType)}
          </Text>
        </View>
      </View>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>
          {formatCurrency(item.balance, item.currency)}
        </Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No Bank Accounts</Text>
      <Text style={styles.emptyStateSubtitle}>
        You haven&apos;t added any bank accounts yet.
      </Text>

      <TouchableOpacity
        style={styles.addAccountButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.addAccountButtonText}>Add Account</Text>
      </TouchableOpacity>
    </View>
  );

  // If no user, don't render anything (auto-logout hook will handle redirect)
  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.header}>
        <Text style={styles.title}>Bank Accounts</Text>
        <Text style={styles.subtitle}>
          {user.bankAccounts.length} account
          {user.bankAccounts.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {isFetchingAccounts ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.tint} />
          <Text style={styles.loadingText}>Loading accounts...</Text>
        </View>
      ) : (
        <FlatList
          data={user.bankAccounts}
          renderItem={renderBankAccount}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />
      )}

      {user.bankAccounts.length > 0 && (
        <TouchableOpacity
          style={styles.floatingAddButton}
          onPress={() => setIsModalVisible(true)}
          disabled={isAddingAccount}
        >
          {isAddingAccount ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.floatingAddButtonText}>+</Text>
          )}
        </TouchableOpacity>
      )}

      <AddBankAccountModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAddAccount={handleAddAccount}
        isLoading={isAddingAccount}
        userId={user.id}
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
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.tabIconDefault,
  },
  listContainer: {
    padding: 20,
    paddingTop: 10,
  },
  accountCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  accountHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  bankInfo: {
    flex: 1,
  },
  bankName: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
  },
  accountTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  accountTypeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  balanceContainer: {
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 15,
  },
  balanceLabel: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: Colors.light.tabIconDefault,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.light.tabIconDefault,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 50,
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
  floatingAddButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.tint,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  floatingAddButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});
