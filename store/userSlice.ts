import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    name: string;
    isLoggedIn: boolean;
}

const initialState: UserState = {
    name: '',
    isLoggedIn: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.name = '';
            state.isLoggedIn = false;
        },
    },
});

export const { setUserName, logout } = userSlice.actions;
export default userSlice.reducer; 
