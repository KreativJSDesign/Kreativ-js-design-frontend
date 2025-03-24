import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";
import api from "../../api";
import { getAccessToken } from "../../utils/api.service";

interface ListingsState {
  listings: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ListingsState = {
  listings: [],
  status: "idle",
  error: null,
};

// Async Thunk for Admin Login
export const getListings = createAsyncThunk("listings", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get(`/etsy/listings`, {
      headers: {
        Authorization: `Bearer  ${getAccessToken()}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || "Login failed");
  }
});

const listingsSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListings.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getListings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.listings = action.payload;
      })
      .addCase(getListings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const allListings = (state: RootState) => state.listings.listings;

export default listingsSlice.reducer;
