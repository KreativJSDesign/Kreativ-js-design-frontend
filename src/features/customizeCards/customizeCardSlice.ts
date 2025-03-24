import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";
import { ApiService } from "../../utils/api.service";
import { normalFailMsg } from "../../utils/utilities";
import { ScratchCard, SingleTemplate } from "../../tsModels/Templates";
import { CardFormTypes } from "../../pages/customizeCard";
interface updateCardPayload {
  cardBody: CardFormTypes;
  cardHeader: CardFormTypes;
  customCardId: string | undefined;
  listing_id: string;
  templateId: string;
}
interface CustomizeCardState {
  status: "idle" | "loading" | "succeeded" | "failed";
  singleCard: SingleTemplate;
  scratchCard: ScratchCard;
  updatedCardId: string;
  cardError: boolean;
}

const initialState: CustomizeCardState = {
  status: "idle",
  singleCard: {} as SingleTemplate,
  scratchCard: {} as ScratchCard,
  updatedCardId: "",
  cardError: false,
};
export const getSingleCard = createAsyncThunk(
  "getSingleCard",
  async (payload: { id: string }, { rejectWithValue }) => {
    try {
      const response = await ApiService.getData(`custom/single-card/${payload?.id}`);
      // if (response.data) {
      //   successMsg(response?.data?.message);
      // }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || "Something went wrong");
    }
  }
);
export const getScratchCard = createAsyncThunk(
  "getScratchCard",
  async (payload: { id: string }, { rejectWithValue }) => {
    try {
      const response = await ApiService.getData(`custom/scratch-card/${payload?.id}`);
      // if (response.data) {
      //   successMsg(response?.data?.message);
      // }
      return response.data;
    } catch (error: any) {
      //   window.location.href = "/not-found";
      return rejectWithValue(error.response.data.message || "Something went wrong");
    }
  }
);
export const updateSingleCard = createAsyncThunk(
  "updateSingleCard",
  async (payload: updateCardPayload, { rejectWithValue }) => {
    try {
      const response = await ApiService.postData(`custom/update-custom-card`, payload);
      // if (response.data) {
      //   successMsg(response?.data?.message);
      // }
      return response.data;
    } catch (error: any) {
      normalFailMsg(error.response?.data?.message || "Something went wrong");
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);
const customizeCardSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    restCardState: (state) => {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSingleCard.pending, (state) => {
        state.status = "loading";
        state.singleCard = {} as SingleTemplate;
        state.cardError = false;
      })
      .addCase(getSingleCard.fulfilled, (state, action) => {
        if (action.payload?.data?.templateInfo) {
          state.singleCard = action.payload.data.templateInfo;
        } else {
          state.singleCard = action.payload?.data;
        }
        state.status = "idle";
      })
      .addCase(getSingleCard.rejected, (state, _action) => {
        state.cardError = true;
        state.status = "failed";
      })
      .addCase(updateSingleCard.pending, (state) => {
        state.updatedCardId = "";
        state.status = "loading";
      })
      .addCase(updateSingleCard.fulfilled, (state, action) => {
        state.updatedCardId = action.payload.data?._id;
        state.status = "succeeded";
      })
      .addCase(updateSingleCard.rejected, (state, _action) => {
        state.status = "failed";
      })
      .addCase(getScratchCard.pending, (state) => {
        state.status = "loading";
        state.scratchCard = {} as ScratchCard;
        state.cardError = false;
      })
      .addCase(getScratchCard.fulfilled, (state, action) => {
        state.scratchCard = action.payload.data;
        state.status = "idle";
      })
      .addCase(getScratchCard.rejected, (state, _action) => {
        state.cardError = true;
        state.status = "failed";
      });
  },
});

export const cardStatus = (state: RootState) => state.cards.status;
export const selectSingleCard = (state: RootState) => state.cards.singleCard;
export const selectUpdatedCardId = (state: RootState) => state.cards.updatedCardId;
export const selectScratchCard = (state: RootState) => state.cards.scratchCard;
export const selectCardError = (state: RootState) => state.cards.cardError;

export const customizeCardActions = customizeCardSlice.actions;
export default customizeCardSlice.reducer;
