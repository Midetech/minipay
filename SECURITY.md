# MiniPay Security Features

## Overview

MiniPay implements a comprehensive security system that ensures users must authenticate every time they open the app, providing maximum protection for financial data.

## Security Features

### 🔒 Mandatory Authentication on App Launch

- **No Automatic Session Restoration**: Users are always logged out when the app starts
- **Explicit Authentication Required**: Users must provide credentials or biometric authentication every time
- **No Persistent Login State**: The app never automatically logs users in from saved session data

### 📱 App State Tracking

- **Background Detection**: Automatically detects when the app goes to background
- **Automatic Logout**: Immediately logs out users when app goes to background
- **Data Clearing**: Clears sensitive user data from storage for security
- **Foreground Re-authentication**: Ensures users must re-authenticate when app comes back to foreground

### 👆 Biometric Authentication

- **Optional Biometric Login**: Users can enable fingerprint/face authentication
- **Device-Level Security**: Uses device biometric authentication
- **Server Validation**: Still validates with server even with biometric
- **Fallback Support**: Falls back to device passcode if biometric fails
- **Security Compliance**: Biometric users still get logged out when app goes to background

### 🛡️ Error Handling

- **User Not Found**: Automatically clears local data if user no longer exists on server
- **Network Errors**: Graceful handling of network connectivity issues
- **Biometric Failures**: Clear error messages and fallback to password login
- **Data Corruption**: Clears data on any storage errors for security

## Implementation Details

### App State Management

```typescript
// Tracks app state changes using React Native's AppState
const handleAppStateChange = (nextAppState: AppStateStatus) => {
  // Logout when app goes to background
  if (
    appState.current === "active" &&
    nextAppState.match(/inactive|background/)
  ) {
    dispatch(clearUserDataAndLogout());
  }

  // Ensure logout when app comes to foreground
  if (
    appState.current.match(/inactive|background/) &&
    nextAppState === "active"
  ) {
    dispatch(clearUserDataAndLogout());
    router.replace("/login");
  }
};
```

### Authentication Flow

1. **App Startup**: User always starts logged out
2. **Login Required**: User must provide credentials or biometric
3. **Server Validation**: Credentials validated with server
4. **Session Active**: User can access app features
5. **App Background**: Automatic logout and data clearing
6. **App Foreground**: User must re-authenticate

### Data Security

- **No Persistent Sessions**: No automatic login from saved data
- **Immediate Data Clearing**: User data cleared when app goes to background
- **Secure Storage**: Sensitive data stored securely using device storage
- **Automatic Cleanup**: Data cleared on errors or user not found scenarios

## Security Benefits

### ✅ Maximum Protection

- Users cannot access the app without explicit authentication
- No risk of unauthorized access from saved session data
- Immediate logout when app is not actively being used

### ✅ User Experience

- Biometric authentication provides convenient but secure login
- Clear error messages guide users through authentication issues
- Graceful handling of network and device issues

### ✅ Compliance Ready

- Meets financial app security requirements
- Implements best practices for mobile app security
- Provides audit trail of authentication events

## Testing

Run the security test suite:

```bash
node test-security.js
```

This will verify all security features are working correctly.

## Configuration

The security features are enabled by default and cannot be disabled for security reasons. The app is designed to provide maximum protection for financial data while maintaining a good user experience through biometric authentication options.
