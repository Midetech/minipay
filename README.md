# MiniPay

A simple React Native mobile banking app built with Expo and Redux.

## Features

- **User Authentication**: Store and greet users by name using React Redux
- **Dashboard**: View and swipe through multiple bank accounts
- **Animated Menu Drawer**: Slide-out menu with smooth animations
- **Profile Management**: User profile screen with logout functionality
- **Dark/Light Mode**: Automatic theme switching based on system preferences

## Screens

### Login Screen

- Enter your name to get started
- Returning users are greeted by name
- Simple and clean interface

### Dashboard Screen

- Welcome message with user's name
- Swipeable bank account cards
- Account balance display
- Action buttons (non-functional as requested)
- Animated menu drawer with hamburger menu

### Profile Screen

- User avatar with initials
- Profile information
- Menu items for various settings
- Logout functionality

## Technical Stack

- **React Native** with Expo
- **Redux Toolkit** for state management
- **React Navigation** for routing
- **React Native Gesture Handler** for swipe gestures
- **React Native Reanimated** for animations
- **TypeScript** for type safety

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

3. Run on your preferred platform:
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`

## Project Structure

```
minipay/
├── app/                    # App screens and navigation
│   ├── login.tsx          # Login screen
│   └── (tabs)/            # Tab navigation
│       ├── index.tsx      # Dashboard screen
│       └── explore.tsx    # Profile screen
├── store/                  # Redux store
│   ├── index.ts           # Store configuration
│   ├── userSlice.ts       # User state management
│   └── hooks.ts           # Typed Redux hooks
└── components/            # Reusable components
```

## State Management

The app uses Redux Toolkit to manage user state:

- User name storage
- Login/logout functionality
- Persistent user session

## Animations

- Smooth menu drawer animations using React Native Reanimated
- Swipe gestures for bank account navigation
- Haptic feedback on tab interactions
