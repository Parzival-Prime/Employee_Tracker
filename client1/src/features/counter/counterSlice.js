import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
    name: 'counter',
    initialState: {
        showPreview: true,
        isLoggedIn: false,
        isAdmin: false,
        theme: 'dark'
    },
    reducers: {
        setShowPreviewFalse: (state) => {
            state.showPreview = false; // This is handled immutably by Immer
        },

        setShowPreviewTrue: (state) => {
            state.showPreview = true; // This is handled immutably by Immer
        },

        setIsLoggedInTrue: (state) => {
            state.isLoggedIn = true; // This is handled immutably by Immer
            // console.log('Counter says loggedIn true')
        },
        
        setIsLoggedInFalse: (state) => {
            state.isLoggedIn = false; // This is handled immutably by Immer
            // console.log('Counter says loggedIn false')
        },

        setIsAdminFalse: (state) => {
            state.isAdmin = false; // This is handled immutably by Immer
            // console.log('Counter says admin false')
        },
        
        setIsAdminTrue: (state) => {
            state.isAdmin = true; // This is handled immutably by Immer
            // console.log('Counter says admin true')
        },

        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light'; // This is handled immutably by Immer
        },
    }
});

export const {
    setShowPreviewFalse,
    setShowPreviewTrue,
    setIsLoggedInFalse,
    setIsLoggedInTrue,
    setIsAdminTrue,
    setIsAdminFalse,
    toggleTheme
} = counterSlice.actions;

export default counterSlice.reducer;
