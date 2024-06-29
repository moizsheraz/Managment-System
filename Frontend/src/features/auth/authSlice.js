import {createSlice} from "@reduxjs/toolkit"
import { ACCESS_TOKEN } from "../../varibales";

const initialState = {
    isAuthenticated : localStorage.getItem(ACCESS_TOKEN),
    userData : null
}

const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers : {
        login(state, action){
            state.isAuthenticated = true;
            state.userData = action.payload;
        },
        logout(state){
            state.isAuthenticated = false;
            state.userData = null;
            localStorage.clear();
        },
        setAuth(state, action) {
            state.isAuthenticated = action.payload.isAuthenticated;
            state.userData = action.payload.userData;
        }
    }
});

export const {login, logout, setAuth}  = authSlice.actions;

export default authSlice.reducer;