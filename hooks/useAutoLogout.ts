import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { clearUserDataAndLogout } from "../store/authThunks";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export const useAutoLogout = () => {
    const dispatch = useAppDispatch();
    const { user, error, isLoggedIn } = useAppSelector((state) => state.user);
    const hasHandledError = useRef(false);
    const previousLoginState = useRef(isLoggedIn);
    const appState = useRef(AppState.currentState);

    // Handle app state changes for security
    useEffect(() => {
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            console.log('App state changed from', appState.current, 'to', nextAppState);

            // When app goes to background, automatically log out for security
            if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
                console.log('App going to background - logging out for security');
                if (isLoggedIn && user) {
                    dispatch(clearUserDataAndLogout());
                }
            }

            // When app comes back to foreground, ensure user is logged out
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                console.log('App coming to foreground - ensuring user is logged out');
                if (isLoggedIn && user) {
                    dispatch(clearUserDataAndLogout());
                    router.replace("/login");
                }
            }

            appState.current = nextAppState;
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription?.remove();
        };
    }, [dispatch, isLoggedIn, user]);

    useEffect(() => {
        const handleUserNotFound = async () => {
            // Check if there's a user not found error and we haven't handled it yet
            if (error && error.includes('User not found') && !hasHandledError.current) {
                hasHandledError.current = true;
                try {
                    console.log('User not found detected, automatically clearing data and logging out');
                    await dispatch(clearUserDataAndLogout()).unwrap();
                    router.replace("/login");
                } catch (error) {
                    console.error('Error during auto logout:', error);
                    // Fallback: just redirect to login
                    router.replace("/login");
                }
            }
        };

        handleUserNotFound();
    }, [error, dispatch]);

    // Reset error handling flag when error changes
    useEffect(() => {
        if (!error) {
            hasHandledError.current = false;
        }
    }, [error]);

    // Handle the case where user becomes null (but only if we were previously logged in)
    useEffect(() => {
        // Only redirect if we were previously logged in and now we're not
        if (previousLoginState.current === true && isLoggedIn === false && !user) {
            console.log('Auto logout: User state changed from logged in to logged out');
            const timer = setTimeout(() => {
                router.replace("/login");
            }, 100);

            return () => clearTimeout(timer);
        }

        // Update the previous state
        previousLoginState.current = isLoggedIn;
    }, [user, isLoggedIn]);
}; 
