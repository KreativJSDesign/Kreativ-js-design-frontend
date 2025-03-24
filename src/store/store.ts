import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import listingsReducer from "../features/listings/listingsSlice";
import templatesReducer from "../features/templates/teamplateSlice";
import customizeCardReducer from "../features/customizeCards/customizeCardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    listings: listingsReducer,
    templates: templatesReducer,
    cards: customizeCardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
