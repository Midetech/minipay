import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/Colors";
import { BankAccount } from "../store/userSlice";

interface AddBankAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onAddAccount: (account: Omit<BankAccount, "id">) => void;
  isLoading?: boolean;
  userId: string;
  resetForm?: () => void;
}

const accountTypes = [
  { value: "savings", label: "Savings" },
  { value: "corporate", label: "Corporate" },
];

const currencies = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "NGN", label: "NGN (₦)" },
];

export default function AddBankAccountModal({
  visible,
  onClose,
  onAddAccount,
  userId,
  isLoading = false,
  resetForm,
}: AddBankAccountModalProps) {
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountType, setAccountType] = useState<"savings" | "credit">(
    "savings"
  );
  const [balance, setBalance] = useState("");
  const [currency, setCurrency] = useState("USD");

  const handleSubmit = () => {
    if (!bankName.trim()) {
      Alert.alert("Error", "Please enter a bank name");
      return;
    }
    if (!accountNumber.trim()) {
      Alert.alert("Error", "Please enter an account number");
      return;
    }
    if (!balance.trim() || isNaN(Number(balance))) {
      Alert.alert("Error", "Please enter a valid balance");
      return;
    }

    const newAccount: Omit<BankAccount, "id"> = {
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
      accountType,
      balance: Number(balance),
      currency,
      userId,
    };

    onAddAccount(newAccount);
  };

  const resetFormFields = () => {
    setBankName("");
    setAccountNumber("");
    setAccountType("savings");
    setBalance("");
    setCurrency("USD");
  };

  // Reset form when modal is closed
  useEffect(() => {
    if (!visible) {
      resetFormFields();
    }
  }, [visible]);

  const handleClose = () => {
    if (!isLoading) {
      resetFormFields();
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Bank Account</Text>
          <TouchableOpacity
            onPress={handleClose}
            style={styles.closeButton}
            disabled={isLoading}
          >
            <Text
              style={[styles.closeButtonText, isLoading && styles.disabledText]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bank Name</Text>
              <TextInput
                style={[styles.input, isLoading && styles.disabledInput]}
                value={bankName}
                onChangeText={setBankName}
                placeholder="Enter bank name"
                placeholderTextColor={Colors.light.tabIconDefault}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Account Number</Text>
              <TextInput
                style={[styles.input, isLoading && styles.disabledInput]}
                value={accountNumber}
                onChangeText={setAccountNumber}
                placeholder="Enter account number"
                placeholderTextColor={Colors.light.tabIconDefault}
                keyboardType="numeric"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Account Type</Text>
              <View style={styles.optionsContainer}>
                {accountTypes.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.optionButton,
                      accountType === type.value && styles.optionButtonSelected,
                      isLoading && styles.disabledOptionButton,
                    ]}
                    onPress={() => setAccountType(type.value as any)}
                    disabled={isLoading}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        accountType === type.value && styles.optionTextSelected,
                        isLoading && styles.disabledText,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Balance</Text>
              <TextInput
                style={[styles.input, isLoading && styles.disabledInput]}
                value={balance}
                onChangeText={setBalance}
                placeholder="0.00"
                placeholderTextColor={Colors.light.tabIconDefault}
                keyboardType="decimal-pad"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Currency</Text>
              <View style={styles.optionsContainer}>
                {currencies.map((curr) => (
                  <TouchableOpacity
                    key={curr.value}
                    style={[
                      styles.optionButton,
                      currency === curr.value && styles.optionButtonSelected,
                      isLoading && styles.disabledOptionButton,
                    ]}
                    onPress={() => setCurrency(curr.value)}
                    disabled={isLoading}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        currency === curr.value && styles.optionTextSelected,
                        isLoading && styles.disabledText,
                      ]}
                    >
                      {curr.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.addButton, isLoading && styles.disabledAddButton]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.addButtonText}>Add Account</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.light.text,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: Colors.light.tint,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: "white",
  },
  disabledInput: {
    backgroundColor: "#F5F5F5",
    color: Colors.light.tabIconDefault,
  },
  optionsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  optionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    backgroundColor: "white",
    alignItems: "center",
  },
  optionButtonSelected: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  disabledOptionButton: {
    backgroundColor: "#F5F5F5",
    borderColor: "#E5E5E5",
  },
  optionText: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: "500",
  },
  optionTextSelected: {
    color: "white",
  },
  disabledText: {
    color: Colors.light.tabIconDefault,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  addButton: {
    backgroundColor: Colors.light.tint,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledAddButton: {
    backgroundColor: Colors.light.tabIconDefault,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
