import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addAccount, getAccount } from './accountThunks';
import { biometricLogin, checkSavedSession, clearUserDataAndLogout, disableBiometric, enableBiometric, loginUser, logoutUser, registerUser } from './authThunks';

export interface BankAccount {
    id: string;
    accountNumber: string;
    accountType: 'savings' | 'checking' | 'credit';
    balance: number;
    currency: string;
    bankName: string;
    userId: string;
}

export interface User {
    id: string;
    username: string;
    name: string;
    email?: string;
    bankAccounts: BankAccount[];
}

interface UserState {
    user: User | null;
    isLoggedIn: boolean;
    isBiometricEnabled: boolean;
    isLoading: boolean;
    error: string | null;
    // Account states
    isAddingAccount: boolean;
    isFetchingAccounts: boolean;
}

const initialState: UserState = {
    user: null,
    isLoggedIn: false,
    isBiometricEnabled: false,
    isLoading: false,
    error: null,
    isAddingAccount: false,
    isFetchingAccounts: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setBiometricEnabled: (state, action: PayloadAction<boolean>) => {
            state.isBiometricEnabled = action.payload;
        },
        updateBankAccounts: (state, action: PayloadAction<BankAccount[]>) => {
            if (state.user) {
                state.user.bankAccounts = action.payload;
            }
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Register user
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoggedIn = true;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Registration failed';
            })
            // Login user
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoggedIn = true;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Login failed';
            })
            // Biometric login
            .addCase(biometricLogin.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(biometricLogin.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoggedIn = true;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(biometricLogin.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Biometric authentication failed';
            })
            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isLoggedIn = false;
                state.isBiometricEnabled = false;
                state.error = null;
            })
            // Clear user data and logout (for user not found scenarios)
            .addCase(clearUserDataAndLogout.fulfilled, (state) => {
                state.user = null;
                state.isLoggedIn = false;
                state.isBiometricEnabled = false;
                state.error = null;
            })
            // Enable biometric
            .addCase(enableBiometric.fulfilled, (state) => {
                state.isBiometricEnabled = true;
            })
            // Disable biometric
            .addCase(disableBiometric.fulfilled, (state) => {
                state.isBiometricEnabled = false;
            })
            // Check saved session
            .addCase(checkSavedSession.fulfilled, (state, action) => {
                if (action.payload) {
                    state.user = action.payload;
                    state.isLoggedIn = true;
                }
            })
            // Add account
            .addCase(addAccount.pending, (state) => {
                state.isAddingAccount = true;
                state.error = null;
            })
            .addCase(addAccount.fulfilled, (state, action) => {
                if (state.user) {
                    state.user.bankAccounts.push(action.payload);
                }
                state.isAddingAccount = false;
                state.error = null;
            })
            .addCase(addAccount.rejected, (state, action) => {
                state.isAddingAccount = false;
                const errorMessage = action.error.message || 'Failed to add bank account';
                state.error = errorMessage;

                // If the error indicates user not found, clear user data
                if (errorMessage.includes('User not found')) {
                    state.user = null;
                    state.isLoggedIn = false;
                    state.isBiometricEnabled = false;
                }
            })
            // Get account
            .addCase(getAccount.pending, (state) => {
                state.isFetchingAccounts = true;
                state.error = null;
            })
            .addCase(getAccount.fulfilled, (state, action) => {
                if (state.user) {
                    state.user.bankAccounts = action.payload;
                }
                state.isFetchingAccounts = false;
                state.error = null;
            })
            .addCase(getAccount.rejected, (state, action) => {
                state.isFetchingAccounts = false;
                const errorMessage = action.error.message || 'Failed to fetch bank accounts';
                state.error = errorMessage;

                // If the error indicates user not found, automatically clear user data
                if (errorMessage.includes('User not found')) {
                    state.user = null;
                    state.isLoggedIn = false;
                    state.isBiometricEnabled = false;
                    // Note: We'll handle the actual logout in the component
                }
            });
    },
});

export const {
    setBiometricEnabled,
    updateBankAccounts,
    clearError
} = userSlice.actions;
export default userSlice.reducer; 
