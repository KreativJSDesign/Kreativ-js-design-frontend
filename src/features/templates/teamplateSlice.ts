import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";
import { ApiService } from "../../utils/api.service";
import { normalFailMsg, successMsg } from "../../utils/utilities";
import { SingleTemplate } from "../../tsModels/Templates";

interface TeamplatesState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  templates: SingleTemplate[];
  remainingTemplates: SingleTemplate[];
  singleTemplate: SingleTemplate;
}

const initialState: TeamplatesState = {
  status: "idle",
  error: null,
  templates: [],
  singleTemplate: {} as SingleTemplate,
  remainingTemplates: [],
};


export const uploadTemplate = createAsyncThunk(
  "uploadTemplate",
  async (payload: FormData, { rejectWithValue }) => {
    try {
      const response = await ApiService.postData("template/upload", payload);
      if (response.data) {
        successMsg(response?.data?.message);
      }
      return response.data;
    } catch (error: any) {
      normalFailMsg(error.response?.data?.error || "Upload failed");
      return rejectWithValue(error.response?.data?.error || "Upload failed");
    }
  }
);
export const getAllTemplates = createAsyncThunk(
  "getAllTemplates",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ApiService.getData("template/all");
      return response.data;
    } catch (error: any) {
      normalFailMsg(error.response?.data?.error || "Fail to get templates");
      return rejectWithValue(error.response?.data?.error || "Fail to get templates");
    }
  }
);
export const deleteTemplate = createAsyncThunk(
  "deleteTemplate",
  async (payload: { id: string }, { rejectWithValue }) => {
    try {
      const response = await ApiService.postData(`template/delete-template`, payload);
      if (response.data) {
        successMsg(response?.data?.message);
      }
      return response.data;
    } catch (error: any) {
      normalFailMsg(error.response?.data?.error || "Delete failed");
      return rejectWithValue(error.response?.data?.error || "Delete failed");
    }
  }
);
export const getTemplate = createAsyncThunk(
  "getTemplate",
  async (payload: { id: string }, { rejectWithValue }) => {
    try {
      const response = await ApiService.getData(`template/single-template/${payload?.id}`);
      // if (response.data) {
      //   successMsg(response?.data?.message);
      // }
      return response.data;
    } catch (error: any) {
      window.location.href = "/not-found";
      normalFailMsg(error.response?.data?.error);
      return rejectWithValue(error.response?.data?.error);
    }
  }
);
export const saveProductTeamplate = createAsyncThunk(
  "saveProductTeamplate",
  async (
    payload: {
      newTemplateId: string | undefined;
      productId: number | undefined;
      oldTemplateId: string | undefined;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await ApiService.postData(`template/selectedTemplate`, payload);
      if (response.data) {
        successMsg(response?.data?.message);
      }
      return response.data;
    } catch (error: any) {
      normalFailMsg(error.response?.data?.error);
      return rejectWithValue(error.response?.data?.error || " failed");
    }
  }
);
export const getRemainingTemplates = createAsyncThunk(
  "getRemainingTemplates",
  async (payload: { id: number }, { rejectWithValue }) => {
    try {
      const response = await ApiService.getData(
        `template/selected-remaining-template/${payload?.id}`
      );
      return response.data.data;
    } catch (error: any) {
      // normalFailMsg(error.response?.data?.error || "Fail to get templates");
      return rejectWithValue(error.response?.data?.error || "Fail to get templates");
    }
  }
);
const teamplatesSlice = createSlice({
  name: "templates",
  initialState,
  reducers: {
    restTemplateState: (state) => {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadTemplate.pending, (state) => {
        state.status = "loading";
      })
      .addCase(uploadTemplate.fulfilled, (state, _action) => {
        state.status = "succeeded";
      })
      .addCase(uploadTemplate.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(getAllTemplates.pending, (state) => {
        state.status = "loading";
        state.templates = [];
      })
      .addCase(getAllTemplates.fulfilled, (state, action) => {
        state.status = "idle";
        state.templates = action.payload.data?.alltemplates;
      })
      .addCase(getAllTemplates.rejected, (state, _action) => {
        state.status = "failed";
      })
      .addCase(deleteTemplate.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteTemplate.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(deleteTemplate.rejected, (state, _action) => {
        state.status = "failed";
      })
      .addCase(saveProductTeamplate.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveProductTeamplate.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(saveProductTeamplate.rejected, (state, _action) => {
        state.status = "failed";
      })
      .addCase(getTemplate.pending, (state) => {
        state.status = "loading";
        state.singleTemplate = {} as SingleTemplate;
      })
      .addCase(getTemplate.fulfilled, (state, action) => {
        state.status = "idle";
        state.singleTemplate = action.payload?.data;
      })
      .addCase(getTemplate.rejected, (state, _action) => {
        state.status = "failed";
      })
      .addCase(getRemainingTemplates.pending, (state) => {
        state.status = "loading";
        state.remainingTemplates = [];
      })
      .addCase(getRemainingTemplates.fulfilled, (state, action) => {
        state.status = "idle";
        state.remainingTemplates = action.payload;
      })
      .addCase(getRemainingTemplates.rejected, (state, _action) => {
        state.status = "failed";
      });
  },
});

export const tempalteStatus = (state: RootState) => state.templates.status;
export const SelectTemplates = (state: RootState) => state.templates.templates;
export const SelectSingleTemplate = (state: RootState) => state.templates.singleTemplate;
export const SelectProductRemainingTemplates = (state: RootState) =>
  state.templates.remainingTemplates;

export const templatesActions = teamplatesSlice.actions;
export default teamplatesSlice.reducer;
