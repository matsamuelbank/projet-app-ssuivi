import { createSlice } from "@reduxjs/toolkit";

export const userInfoSlice = createSlice({
    name: "userInfoSlice",
    initialState: {
        userInfo: {
            isAuthenticated: false
        },
    },
    reducers: {
        addUserInfo: (state, action) => {
            state.userInfo = { ...state.userInfo, ...action.payload,isAuthenticated: true }; // Met à jour l'objet utilisateur avec les nouvelles données
        },
        clearUserInfo: (state) => {
            state.userInfo = {isAuthenticated: false}; 
        }
    }
});

export const userInfoReducer = userInfoSlice.reducer;

// Exportation des actions générées par le slice
export const { addUserInfo, clearUserInfo } = userInfoSlice.actions;