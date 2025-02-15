import { configureStore } from "@reduxjs/toolkit";
import formReducer from "../redux/form/formSlice";

export const store = configureStore({
  reducer: {
    form: formReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
