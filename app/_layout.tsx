import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Provider } from "react-redux";

import { store } from "@/store";
import { useAppSelector } from "@/store/hooks";

function RootLayoutNav() {
  const router = useRouter();
  const { isLoggedIn, user } = useAppSelector((state) => state.user);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Small delay to ensure component is mounted
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      if (!isLoggedIn) {
        router.replace("/login");
      } else {
        router.replace("/(tabs)");
      }
    }
  }, [isLoggedIn, isInitialized, router]);

  // Show loading state while initializing
  if (!isInitialized) {
    return <View style={{ flex: 1, backgroundColor: "#fff" }} />;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
