import { createAsyncThunk } from '@reduxjs/toolkit';
import * as LocalAuthentication from 'expo-local-authentication';
import { apiService, storageService } from '../services/api';

// Register new user thunk
export const registerUser = createAsyncThunk(
    'user/register',
    async ({ name, username, password }: { name: string; username: string; password: string }, { rejectWithValue }) => {
        try {
            const user = await apiService.createUser({ name, username, password });

            // Save user data to local storage
            await storageService.saveUserData(user);
            await storageService.setLastLogin(Date.now());

            return user;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Registration failed';
            return rejectWithValue(errorMessage);
        }
    }
);

// Login thunk
export const loginUser = createAsyncThunk(
    'user/login',
    async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
        try {
            const user = await apiService.login(username, password);

            // Save user data to local storage
            await storageService.saveUserData(user);
            await storageService.setLastLogin(Date.now());

            return user;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            return rejectWithValue(errorMessage);
        }
    }
);


export const getUserById = createAsyncThunk(
    'user/getUserById',
    async (userId: string, { rejectWithValue }) => {
        try {
            const user = await apiService.getUserById(userId);
            return user;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to get user';
            return rejectWithValue(errorMessage);
        }
    }
);

// Biometric login thunk
export const biometricLogin = createAsyncThunk(
    'user/biometricLogin',
    async (_, { rejectWithValue }) => {
        try {
            // Check if biometric is supported
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            if (!hasHardware) {
                throw new Error('Biometric authentication is not supported on this device');
            }

            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            if (!isEnrolled) {
                throw new Error('No biometric enrolled on this device');
            }

            // Get stored user data
            const userData = await storageService.getUserData();
            if (!userData) {
                throw new Error('No saved user data found. Please login with username and password first.');
            }

            // Authenticate with biometric
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Authenticate with biometric',
                cancelLabel: 'Cancel',
                fallbackLabel: 'Use Passcode',
                disableDeviceFallback: false,
            });

            if (!result.success) {
                throw new Error('Biometric authentication failed');
            }

            // Update last login
            await storageService.setLastLogin(Date.now());

            return userData;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Biometric authentication failed';
            return rejectWithValue(errorMessage);
        }
    }
);

// Logout thunk
export const logoutUser = createAsyncThunk(
    'user/logout',
    async () => {
        try {
            // Clear stored data
            await storageService.clearUserData();
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }
);

// Enable biometric authentication
export const enableBiometric = createAsyncThunk(
    'user/enableBiometric',
    async (_, { rejectWithValue }) => {
        try {
            // Check if biometric is supported
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            if (!hasHardware) {
                throw new Error('Biometric authentication is not supported on this device');
            }

            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            if (!isEnrolled) {
                throw new Error('No biometric enrolled on this device');
            }

            // Test biometric authentication
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Authenticate to enable biometric login',
                cancelLabel: 'Cancel',
                fallbackLabel: 'Use Passcode',
                disableDeviceFallback: false,
            });

            if (!result.success) {
                throw new Error('Biometric authentication failed');
            }

            // Save biometric setting
            await storageService.setBiometricEnabled(true);
            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to enable biometric';
            return rejectWithValue(errorMessage);
        }
    }
);

// Disable biometric authentication
export const disableBiometric = createAsyncThunk(
    'user/disableBiometric',
    async () => {
        try {
            await storageService.setBiometricEnabled(false);
        } catch (error) {
            console.error('Error disabling biometric:', error);
            throw error;
        }
    }
);

// Check for saved user session
export const checkSavedSession = createAsyncThunk(
    'user/checkSavedSession',
    async (_, { dispatch }) => {
        try {
            const userData = await storageService.getUserData();
            const biometricEnabled = await storageService.getBiometricEnabled();

            if (userData && biometricEnabled) {
                // Validate that the user still exists on the server
                try {
                    await apiService.getUserById(userData.id);
                    return userData;
                } catch (error) {
                    // If user is not found on server, clear stored data automatically
                    console.log('Stored user not found on server, clearing data');
                    await storageService.clearUserData();
                    return null;
                }
            }

            return null;
        } catch (error) {
            console.error('Error checking saved session:', error);
            // Clear data on any error to be safe
            await storageService.clearUserData();
            return null;
        }
    }
);

// Clear user data and logout (for handling user not found scenarios)
export const clearUserDataAndLogout = createAsyncThunk(
    'user/clearUserDataAndLogout',
    async () => {
        try {
            // Clear stored data
            await storageService.clearUserData();
        } catch (error) {
            console.error('Error clearing user data:', error);
        }
    }
);

