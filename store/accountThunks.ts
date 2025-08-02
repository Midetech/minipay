import { apiService } from "@/services/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { clearUserDataAndLogout } from "./authThunks";
import { BankAccount } from "./userSlice";

// Add bank account thunk
export const addAccount = createAsyncThunk(
    'bank-accounts/addAccount',
    async ({ userId, account }: { userId: string; account: Omit<BankAccount, 'id'> }, { dispatch, rejectWithValue }) => {
        try {
            // Validate user exists first
            const userExists = await apiService.validateUser(userId);
            if (!userExists) {
                // Automatically clear user data and logout
                await dispatch(clearUserDataAndLogout()).unwrap();
                throw new Error('User not found - your account may have been deleted or is invalid');
            }

            const newAccount = await apiService.addBankAccount(userId, account);
            return newAccount;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to add bank account';
            return rejectWithValue(errorMessage);
        }
    }
);

// Get bank accounts thunk
export const getAccount = createAsyncThunk(
    'bank-accounts/getAccount',
    async (userId: string, { dispatch, rejectWithValue }) => {
        try {
            // Validate user exists first
            const userExists = await apiService.validateUser(userId);
            if (!userExists) {
                // Automatically clear user data and logout
                await dispatch(clearUserDataAndLogout()).unwrap();
                throw new Error('User not found - your account may have been deleted or is invalid');
            }

            const accounts = await apiService.getBankAccounts(userId);
            return accounts;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch bank accounts';
            return rejectWithValue(errorMessage);
        }
    }
);
