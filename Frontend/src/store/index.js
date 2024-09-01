import { configureStore } from '@reduxjs/toolkit';
import authSlice, {setAuth} from '../features/auth/authSlice';

const store = configureStore({
    reducer : {
        auth : authSlice
    }
});

const storedAuth = JSON.parse(localStorage.getItem('auth'));
if (storedAuth) {
  store.dispatch(setAuth(storedAuth));
}

export default store;