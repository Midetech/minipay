# MiniPay - Mobile Payment App

A React Native mobile payment application with biometric authentication and bank account management.

## Features

### 🔐 Authentication

- **Username/Password Login**: Secure authentication with mocked backend
- **Biometric Authentication**: Fingerprint and facial recognition support
- **Session Persistence**: Automatic login with saved credentials
- **Logout Functionality**: Secure logout with data clearing

### 🏦 Bank Account Management

- **Multiple Bank Accounts**: Support for checking, savings, and credit accounts
- **Account Display**: Beautiful card-based UI for account information
- **Balance Tracking**: Real-time balance display with currency formatting
- **Account Types**: Visual distinction between different account types

### 🎨 User Interface

- **Modern Design**: Clean, intuitive interface with smooth animations
- **Tab Navigation**: Easy navigation between Home, Accounts, Explore, and Profile
- **Responsive Layout**: Optimized for different screen sizes
- **Loading States**: Proper loading indicators and error handling

## Technical Implementation

### Backend Integration

- **Mocked REST API**: Simulated backend using in-memory data store
- **API Service Layer**: Centralized API communication with error handling
- **Data Persistence**: Local storage for user sessions and preferences

### State Management

- **Redux Toolkit**: Centralized state management with async thunks
- **User Authentication**: Complete auth flow with biometric support
- **Bank Account Data**: Real-time account information management

### Biometric Authentication

- **Expo Local Authentication**: Native biometric authentication
- **Hardware Detection**: Automatic detection of biometric capabilities
- **Fallback Support**: Graceful fallback to passcode when needed

## Demo Credentials

Use these credentials to test the application:

- **Username**: `john_doe` or `jane_smith`
- **Password**: `password123`

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
│   ├── login.tsx         # Authentication screen
│   └── _layout.tsx       # Root layout
├── components/            # Reusable UI components
├── constants/            # App constants and colors
├── services/             # API and storage services
├── store/               # Redux store and slices
└── hooks/               # Custom React hooks
```

## Key Components

### Authentication Flow

1. **Login Screen**: Username/password or biometric login
2. **Session Check**: Automatic session restoration on app launch
3. **Biometric Setup**: Enable biometric authentication after login
4. **Logout**: Secure logout with data clearing

### Bank Account Features

- **Account Display**: Card-based UI showing account details
- **Balance Formatting**: Proper currency formatting
- **Account Types**: Visual distinction for different account types
- **Empty States**: Helpful messages when no accounts exist

## API Endpoints (Mocked)

- `POST /login` - User authentication
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

## Security Features

- **Biometric Authentication**: Secure device-based authentication
- **Session Management**: Proper session handling and cleanup
- **Data Encryption**: Local storage encryption (handled by AsyncStorage)
- **Error Handling**: Comprehensive error handling and user feedback

## Future Enhancements

- [ ] Real backend integration
- [ ] Push notifications
- [ ] Transaction history
- [ ] Money transfer functionality
- [ ] QR code payments
- [ ] Multi-currency support
- [ ] Advanced security features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
