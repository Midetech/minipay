import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { clearUserDataAndLogout } from "../store/authThunks";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export const useAutoLogout = () => {
    const dispatch = useAppDispatch();
    const { user, error, isLoggedIn } = useAppSelector((state) => state.user);
    const hasHandledError = useRef(false);

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
        if (!user && isLoggedIn === false) {
            // Only redirect if we're not in the middle of a normal logout
            const timer = setTimeout(() => {
                router.replace("/login");
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [user, isLoggedIn]);
}; 
