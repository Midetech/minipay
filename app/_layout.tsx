import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";

import { store } from "@/store";

export default function RootLayout() {
  // const dispatch = useAppDispatch();

  // useEffect(() => {
  //   // Check if user is already logged in
  //   const checkUser = async () => {
  //     // For demo purposes, we'll set a default user
  //     dispatch(setUserName("John Doe"));
  //   };

  //   checkUser();
  // }, [dispatch]);

  return (
    <Provider store={store}>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
}
