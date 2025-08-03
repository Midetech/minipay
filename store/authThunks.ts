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
            await storageService.savePassword(password); // Save password for biometric auth
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

            // Get stored user data and check if biometric is enabled
            const userData = await storageService.getUserData();
            const biometricEnabled = await storageService.getBiometricEnabled();
            const savedPassword = await storageService.getPassword();

            if (!userData) {
                throw new Error('No saved user data found. Please login with username and password first.');
            }

            if (!biometricEnabled) {
                throw new Error('Biometric authentication is not enabled for this account.');
            }

            if (!savedPassword) {
                throw new Error('No saved password found. Please login with username and password first.');
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

            // Now authenticate with the server using saved credentials
            const user = await apiService.login(userData.username, savedPassword);

            // Update last login
            await storageService.setLastLogin(Date.now());

            return user;
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
    async (password: string, { rejectWithValue }) => {
        try {
            console.log('enableBiometric: starting biometric setup');

            // Check if biometric is supported
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            console.log('enableBiometric: hasHardware:', hasHardware);

            if (!hasHardware) {
                throw new Error('Biometric authentication is not supported on this device');
            }

            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            console.log('enableBiometric: isEnrolled:', isEnrolled);

            if (!isEnrolled) {
                throw new Error('No biometric enrolled on this device');
            }

            // Test biometric authentication
            console.log('enableBiometric: requesting biometric authentication');
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Authenticate to enable biometric login',
                cancelLabel: 'Cancel',
                fallbackLabel: 'Use Passcode',
                disableDeviceFallback: false,
            });

            console.log('enableBiometric: authentication result:', result);

            if (!result.success) {
                throw new Error('Biometric authentication failed');
            }

            // Save biometric setting and password
            console.log('enableBiometric: saving biometric settings');
            await storageService.setBiometricEnabled(true);
            await storageService.savePassword(password);

            console.log('enableBiometric: biometric setup completed successfully');
            return true;
        } catch (error) {
            console.log('enableBiometric: error:', error);
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
            await storageService.clearPassword();
        } catch (error) {
            console.error('Error disabling biometric:', error);
            throw error;
        }
    }
);

// Clear user data and logout (for handling user not found scenarios and app state changes)
export const clearUserDataAndLogout = createAsyncThunk(
    'user/clearUserDataAndLogout',
    async () => {
        try {
            // Clear all stored data for security
            await storageService.clearUserData();
            console.log('User data cleared for security');
        } catch (error) {
            console.error('Error clearing user data:', error);
        }
    }
);

