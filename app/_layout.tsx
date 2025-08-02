import { useAutoLogout } from "@/hooks/useAutoLogout";
import { checkSavedSession } from "@/store/authThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Provider } from "react-redux";

import { store } from "@/store";

function RootLayoutNav() {
  const dispatch = useAppDispatch();
  const { isLoggedIn, isBiometricEnabled } = useAppSelector(
    (state) => state.user
  );

  console.log("isBiometricEnabled", isBiometricEnabled);

  // Auto-logout hook to handle user not found scenarios
  useAutoLogout();

  useEffect(() => {
    // Check for saved user session on app launch
    dispatch(checkSavedSession());
  }, [dispatch]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        {!isLoggedIn ? (
          <Stack.Screen name="login" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        )}
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}
