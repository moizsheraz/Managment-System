import {createSlice} from "@reduxjs/toolkit"
import { ACCESS_TOKEN } from "../../varibales";

const storedAuth = JSON.parse(localStorage.getItem('auth'))

const initialState = {
    isAuthenticated : !!localStorage.getItem(ACCESS_TOKEN),
    userData : storedAuth ? storedAuth.userData : null,
}

const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers : {
        login(state, action){
            state.isAuthenticated = true;
            state.userData = action.payload;
            localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, userData: action.payload }));
        },
        logout(state){
            state.isAuthenticated = false;
            state.userData = null;
            localStorage.clear();
        },
        setAuth(state, action) {
            state.isAuthenticated = action.payload.isAuthenticated;
            state.userData = action.payload.userData;
            localStorage.setItem('auth', JSON.stringify(action.payload));
        }
    }
});

export const {login, logout, setAuth}  = authSlice.actions;

export default authSlice.reducer;