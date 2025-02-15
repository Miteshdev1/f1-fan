import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Driver, DriverStanding, FormState, ErrorResponse } from "./types";
const baseURL = process.env.REACT_APP_BASE_URL;
const DRIVERS_API_URL = `${baseURL}drivers/`;
const STANDINGS_API_URL = `${baseURL}driverstandings/`;

const initialState: FormState = {
  step: 1,
  userDetails: { name: "", email: "", selectedDriver: { driverId: "" } },
  driversList: [],
  driverStandings: [],
  loading: false,
  error: null,
  validationError: {},
};
/**
 * Helper function to handle API errors consistently.
 * Extracts the error message from the response or provides a default message.
 * @param error - The error object caught during the API call.
 * @returns A string representing the error message.
 */
const handleApiError = (error: unknown): string => {
  const err = error as ErrorResponse;
  return (
    err.response?.data?.detail ||
    "Failed to fetch data. Please try again later."
  );
};
/**
 * Async thunk to fetch driver data.
 * Makes an API call to the DRIVERS_API_URL and dispatches actions based on the result.
 */
export const fetchDrivers = createAsyncThunk<
  Driver[],
  void,
  { rejectValue: string }
>("form/fetchDrivers", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(DRIVERS_API_URL);
    return response.data.MRData.DriverTable.Drivers;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});
/**
 * Async thunk to fetch driver standings data.
 * Makes an API call to the STANDINGS_API_URL and dispatches actions based on the result.
 * Handles cases where the API response might have an empty data array.
 */

export const fetchDriverStandings = createAsyncThunk<
  DriverStanding[],
  void,
  { rejectValue: string }
>("form/fetchDriverStandings", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(STANDINGS_API_URL);
    const standings = response.data.MRData.StandingsTable.StandingsLists;
    return standings && standings.length > 0
      ? standings[0].DriverStandings
      : []; // Handle potential empty data
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    /**
     * Sets the current step in the form process.
     * @param state - The current state of the form slice.
     * @param action - Contains the payload with the new step value (number).
     */
    setStep: (state, action) => {
      state.step = action.payload;
    },

    /**
     * Updates the basic information (name and email).
     * @param state - The current state of the form slice.
     * @param action - Contains the payload with name and email.
     */
    setBasicInfo: (state, action) => {
      state.userDetails = { ...state.userDetails, ...action.payload };
    },

    /**
     * Selects a driver from the driver list.
     * @param state - The current state of the form slice.
     * @param action - Contains the selected driver object.
     */
    selectDriver: (state, action) => {
      state.userDetails.selectedDriver = action.payload;
    },

    /**
     * Error list of form.
     * @param state - The current state of the form slice.
     * @param action - Contains the error.
     */
    setValidationErrors: (state, action) => {
      state.validationError = { ...state.validationError, ...action.payload };
    },
    clearForm: (state) => {
      state.userDetails = {
        name: "",
        email: "",
        selectedDriver: { driverId: "" },
      };
      state.validationError = {};
      state.step = 1;
    },
  },
  extraReducers: (builder) => {
    // DRY principle for extraReducers: handles pending, fulfilled, and rejected states for both fetch thunks.
    [fetchDrivers, fetchDriverStandings].forEach((fetchThunk) => {
      // DRY principle for extraReducers
      builder.addCase(fetchThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      });

      builder.addCase(fetchThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (fetchThunk === fetchDrivers) {
          state.driversList = action.payload as [];
        } else {
          state.driverStandings = action.payload as [];
        }
      });

      builder.addCase(fetchThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    });
  },
});

export const {
  setStep,
  setBasicInfo,
  selectDriver,
  setValidationErrors,
  clearForm,
} = formSlice.actions;
export default formSlice.reducer;
