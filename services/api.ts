import AsyncStorage from '@react-native-async-storage/async-storage';
import { BankAccount, User } from '../store/userSlice';

// API Configuration
const API_BASE_URL = 'https://688d4d7aa459d5566b120ec1.mockapi.io/api/v1';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API Response interfaces
interface ApiUser {
    id: string;
    name: string;
    username: string;
    password: string;
    createdAt: string;
    updatedAt: string;
}

interface CreateUserRequest {
    name: string;
    username: string;
    password: string;
}

class ApiService {
    private baseUrl = API_BASE_URL;

    // Helper method to handle API requests
    private async makeRequest<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const defaultOptions: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, defaultOptions);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Create new user account
    async createUser(userData: CreateUserRequest): Promise<User> {
        await delay(1000); // Simulate network delay

        try {
            const apiUser = await this.makeRequest<ApiUser>('/user', {
                method: 'POST',
                body: JSON.stringify(userData),
            });

            // Convert API user to app user format
            const user: User = {
                id: apiUser.id,
                username: apiUser.username,
                name: apiUser.name,
                bankAccounts: [], // New users start with no bank accounts
            };

            return user;
        } catch (error) {
            if (error instanceof Error && error.message.includes('409')) {
                throw new Error('Username already exists');
            }
            throw new Error('Failed to create account');
        }
    }

    // Authentication - login with username and password
    async login(username: string, password: string): Promise<User> {
        await delay(1000); // Simulate network delay

        try {
            // Get all users to find matching credentials
            const users = await this.makeRequest<ApiUser[]>('/user');

            const user = users.find(u =>
                u.username === username && u.password === password
            );

            if (!user) {
                throw new Error('Invalid username or password');
            }

            // Convert API user to app user format
            const appUser: User = {
                id: user.id,
                username: user.username,
                name: user.name,
                bankAccounts: [], // For now, we'll handle bank accounts separately
            };

            return appUser;
        } catch (error) {
            if (error instanceof Error && error.message.includes('Invalid username or password')) {
                throw error;
            }
            throw new Error('Login failed. Please try again.');
        }
    }

    // Get user by ID
    async getUserById(userId: string): Promise<User & { password: string }> {
        await delay(500);

        try {
            const apiUser = await this.makeRequest<ApiUser>(`/user/${userId}`);

            const user: User & { password: string } = {
                id: apiUser.id,
                username: apiUser.username,
                password: apiUser.password,
                name: apiUser.name,
                bankAccounts: [], // Bank accounts would be handled separately in a real app
            };

            return user;
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('404') || error.message.includes('not found')) {
                    throw new Error('User not found - your account may have been deleted or is invalid');
                }

                throw error;
            }
            throw new Error('User not found - please login again');
        }
    }

    // Validate user exists
    async validateUser(userId: string): Promise<boolean> {
        try {
            await this.getUserById(userId);
            return true;
        } catch (error) {
            return false;
        }
    }

    // Get bank accounts (mocked for now)
    async getBankAccounts(userId: string): Promise<BankAccount[]> {
        await delay(800);
        try {
            const bankAccounts = await this.makeRequest<BankAccount[]>(`/bank-accounts`);

            const userBankAccounts = bankAccounts.filter((account) => account.userId === userId);

            return userBankAccounts;
        } catch (error) {
            throw new Error('Failed to fetch bank accounts');
        }
    }

    // Add bank account (mocked)
    async addBankAccount(userId: string, account: Omit<BankAccount, 'id'>): Promise<BankAccount> {
        await delay(1000);
        try {
            const newAccount = await this.makeRequest<BankAccount>(`/bank-accounts`, {
                method: 'POST',
                body: JSON.stringify({
                    ...account,
                    userId
                })
            });

            return newAccount;
        } catch (error) {
            throw new Error('Failed to add bank account');
        }
    }
}

export const apiService = new ApiService();

// Storage keys
export const STORAGE_KEYS = {
    USER_DATA: 'user_data',
    BIOMETRIC_ENABLED: 'biometric_enabled',
    LAST_LOGIN: 'last_login',
    PASSWORD: 'password'
};

// Local storage utilities
export const storageService = {
    async saveUserData(user: User): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    },

    async getUserData(): Promise<User | null> {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    },

    async clearUserData(): Promise<void> {
        try {
            await AsyncStorage.multiRemove([
                STORAGE_KEYS.USER_DATA,
                STORAGE_KEYS.BIOMETRIC_ENABLED,
                STORAGE_KEYS.LAST_LOGIN,
                STORAGE_KEYS.PASSWORD
            ]);
        } catch (error) {
            console.error('Error clearing user data:', error);
        }
    },

    async setBiometricEnabled(enabled: boolean): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, JSON.stringify(enabled));
        } catch (error) {
            console.error('Error saving biometric setting:', error);
        }
    },

    async savePassword(password: string): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.PASSWORD, password);
        } catch (error) {
            console.error('Error saving password:', error);
        }
    },
    async getBiometricEnabled(): Promise<boolean> {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.BIOMETRIC_ENABLED);
            return data ? JSON.parse(data) : false;
        } catch (error) {
            console.error('Error getting biometric setting:', error);
            return false;
        }
    },

    async setLastLogin(timestamp: number): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.LAST_LOGIN, JSON.stringify(timestamp));
        } catch (error) {
            console.error('Error saving last login:', error);
        }
    },

    async getLastLogin(): Promise<number | null> {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.LAST_LOGIN);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting last login:', error);
            return null;
        }
    },

    async getPassword(): Promise<string | null> {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.PASSWORD);
            return data || null;
        } catch (error) {
            console.error('Error getting password:', error);
            return null;
        }
    },

    async clearPassword(): Promise<void> {
        try {
            await AsyncStorage.removeItem(STORAGE_KEYS.PASSWORD);
        } catch (error) {
            console.error('Error clearing password:', error);
        }
    }
}; 
