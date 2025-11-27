"use client";

import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface User {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
  apiKey: string;
  apiToken: string;
}

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: Cookies.get("user") ? JSON.parse(Cookies.get("user")!) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      Cookies.set("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      Cookies.remove("user");
    },
    updateVerified: (state) => {
      if (state.user) {
        state.user.isVerified = true;
        Cookies.set("user", JSON.stringify(state.user));
      }
    },
  },
});

export const { setUser, logout, updateVerified } = authSlice.actions;

export default authSlice.reducer;
