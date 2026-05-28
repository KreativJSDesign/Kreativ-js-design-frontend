import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";
import { LoginFormData } from "../../pages/Login";
import Cookies from "js-cookie";
import api from "../../api";

interface AuthState {
  isAdmin: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  isAdmin: false,
  status: "idle",
  error: null,
};

// Async Thunk for Admin Login
export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (data: LoginFormData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/auth/admin/login`, data);
      Cookies.set("auth_token", response.data.token, { expires: 7 });
      return response.data.status === "success";
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Login failed");
    }
  }
);
// Async Thunk for Admin Logout
export const logoutAdmin: any = createAsyncThunk("auth/logoutAdmin", async () => {
  // Simulate an API call for logout
  return false; // Logout successful
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAdmin = action.payload;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(logoutAdmin.fulfilled, (state, action) => {
        state.isAdmin = action.payload;
        state.status = "idle";
      });
  },
});

export const selectIsAdmin = (state: RootState) => state.auth.isAdmin;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
