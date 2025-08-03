# MiniPay - Mobile Payment App

A React Native mobile payment application with biometric authentication, bank account management, and modern UI/UX.

## Features

### 🔐 Authentication & Security

- **Username/Password Login**: Secure authentication with mocked backend
- **User Registration**: Create new accounts with username and password
- **Biometric Authentication**: Fingerprint and facial recognition support
- **Session Persistence**: Automatic login with saved credentials
- **Auto Logout**: Security feature that logs out users when app goes to background
- **Secure Logout**: Complete data clearing on logout

### 🏦 Bank Account Management

- **Multiple Bank Accounts**: Support for savings and credit accounts
- **Add New Accounts**: Modal interface to add bank accounts with validation
- **Account Display**: Beautiful card-based UI for account information
- **Balance Tracking**: Real-time balance display with currency formatting
- **Account Types**: Visual distinction between different account types
- **Currency Support**: Multiple currencies (USD, EUR, GBP, NGN)
- **Account Security**: Masked account numbers for privacy

### 🎨 User Interface & Experience

- **Modern Design**: Clean, intuitive interface with smooth animations
- **Tab Navigation**: Easy navigation between Home, Accounts, Explore, and Profile
- **Responsive Layout**: Optimized for different screen sizes
- **Loading States**: Proper loading indicators and error handling
- **Haptic Feedback**: Tactile feedback for better user experience
- **Animated Components**: Smooth transitions and micro-interactions
- **Dark/Light Theme Support**: Adaptive theming system

### 📱 Dashboard Features

- **Account Overview**: Quick view of all bank accounts
- **Balance Summary**: Total balance across all accounts
- **Recent Activity**: Transaction history and activity feed
- **Quick Actions**: Easy access to common functions
- **Side Menu**: Hamburger menu with additional options

### 🔍 Explore Section

- **Quick Actions**: Discover new features and manage account
- **Recent Activity**: View recent transactions and activities
- **Quick Links**: Access to transaction history, payment methods, security settings
- **Help & Support**: Easy access to support resources

### 👤 Profile Management

- **User Information**: Display and manage user details
- **Biometric Settings**: Enable/disable biometric authentication
- **Security Preferences**: Manage authentication methods
- **Account Settings**: User preferences and configurations

## Technical Implementation

### Backend Integration

- **Mocked REST API**: Simulated backend using external API service
- **API Service Layer**: Centralized API communication with error handling
- **Data Persistence**: Local storage for user sessions and preferences
- **Real API Endpoints**: Integration with mockapi.io for user management

### State Management

- **Redux Toolkit**: Centralized state management with async thunks
- **User Authentication**: Complete auth flow with biometric support
- **Bank Account Data**: Real-time account information management
- **Session Management**: Proper session handling and cleanup

### Biometric Authentication

- **Expo Local Authentication**: Native biometric authentication
- **Hardware Detection**: Automatic detection of biometric capabilities
- **Fallback Support**: Graceful fallback to passcode when needed
- **Setup Flow**: Guided biometric setup process

### Data Storage

- **AsyncStorage**: Local data persistence for user data
- **Secure Storage**: Password and sensitive data encryption
- **Session Management**: Automatic session restoration
- **Data Synchronization**: Real-time data updates

## Demo Credentials

Use these credentials to test the application:

- **Username**: `midecodes`
- **Password**: `password`

Account can also be created on the app

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd minipay
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Run on your preferred platform:

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Project Structure

```
minipay/
├── app/                    # Expo Router screens
│   ├── (tabs)/           # Tab navigation screens
│   │   ├── index.tsx     # Dashboard/Home screen
│   │   ├── bank-accounts.tsx # Bank accounts management
│   │   ├── explore.tsx   # Explore features
│   │   └── profile.tsx   # User profile
│   ├── login.tsx         # Authentication screen
│   └── _layout.tsx       # Root layout
├── components/            # Reusable UI components
│   ├── AddBankAccountModal.tsx # Add bank account modal
│   ├── BiometricSetupModal.tsx # Biometric setup
│   ├── Card.tsx          # Reusable card component
│   └── ui/               # UI components
├── constants/            # App constants and colors
├── services/             # API and storage services
├── store/               # Redux store and slices
│   ├── userSlice.ts     # User state management
│   ├── authThunks.ts    # Authentication actions
│   └── accountThunks.ts # Account management actions
└── hooks/               # Custom React hooks
```

## Key Components

### Authentication Flow

1. **Login Screen**: Username/password or biometric login
2. **Registration**: New user account creation
3. **Session Check**: Automatic session restoration on app launch
4. **Biometric Setup**: Enable biometric authentication after login
5. **Auto Logout**: Security feature for background app state
6. **Logout**: Secure logout with data clearing

### Bank Account Features

- **Account Display**: Card-based UI showing account details
- **Add Account Modal**: Form-based account addition with validation
- **Balance Formatting**: Proper currency formatting
- **Account Types**: Visual distinction for different account types
- **Empty States**: Helpful messages when no accounts exist
- **Currency Support**: Multiple currency options

### Dashboard Features

- **Account Overview**: Quick summary of all accounts
- **Animated Cards**: Smooth card animations and interactions
- **Side Menu**: Hamburger menu with additional options
- **Real-time Updates**: Live data synchronization

## API Endpoints

- `POST /user` - Create new user account
- `GET /user` - Get all users (for login validation)
- `GET /user/:id` - Get user information
- `GET /user/:id/accounts` - Get user's bank accounts
- `POST /user/:id/accounts` - Add new bank account
- `PUT /user/:id/accounts/:accountId` - Update bank account
- `DELETE /user/:id/accounts/:accountId` - Delete bank account

## Technologies Used

- **React Native**: Mobile app framework
- **Expo**: Development platform and tools
- **Redux Toolkit**: State management
- **Expo Local Authentication**: Biometric authentication
- **AsyncStorage**: Local data persistence
- **TypeScript**: Type safety and better development experience
- **React Native Gesture Handler**: Advanced touch interactions
- **Expo Haptics**: Tactile feedback
- **Expo Blur**: Visual effects and blur components

## Security Features

- **Biometric Authentication**: Secure device-based authentication
- **Session Management**: Proper session handling and cleanup
- **Data Encryption**: Local storage encryption (handled by AsyncStorage)
- **Auto Logout**: Security feature for background app state
- **Error Handling**: Comprehensive error handling and user feedback
- **Input Validation**: Form validation and sanitization

## UI/UX Features

- **Modern Design**: Clean, intuitive interface
- **Smooth Animations**: Micro-interactions and transitions
- **Haptic Feedback**: Tactile responses for better UX
- **Responsive Design**: Optimized for different screen sizes
- **Loading States**: Proper loading indicators
- **Error States**: User-friendly error messages
- **Empty States**: Helpful guidance when no data exists

## Future Enhancements

- [ ] Real backend integration
- [ ] Push notifications
- [ ] Transaction history
- [ ] Money transfer functionality
- [ ] QR code payments
- [ ] Multi-currency support
- [ ] Advanced security features
- [ ] Offline mode support
- [ ] Data export functionality
- [ ] Advanced analytics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
