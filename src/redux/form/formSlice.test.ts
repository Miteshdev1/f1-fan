import axios from "axios";
import { configureStore } from "@reduxjs/toolkit";
import formSlice, {
  setStep,
  setBasicInfo,
  selectDriver,
  fetchDriverStandings,
  fetchDrivers,
} from "./formSlice";
jest.mock("axios");

describe("formSlice reducer", () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: { form: formSlice },
    });
  });

  it("should handle initial state", () => {
    const state = store.getState().form;
    expect(state).toEqual({
      step: 1,
      userDetails: { name: "", email: "", selectedDriver: { driverId: "" } },
      driversList: [],
      driverStandings: [],
      loading: false,
      error: null,
      validationError: {},
    });
  });

  it("should handle setStep", () => {
    store.dispatch(setStep(2));
    const state = store.getState().form;
    expect(state.step).toBe(2);
  });

  it("should handle setBasicInfo", () => {
    store.dispatch(
      setBasicInfo({ name: "John Doe", email: "john@example.com" })
    );
    const state = store.getState().form.userDetails;
    expect(state.name).toBe("John Doe");
    expect(state.email).toBe("john@example.com");
  });

  it("should handle selectDriver", () => {
    const driver = { id: "driver123", name: "Lewis Hamilton" };
    store.dispatch(selectDriver(driver));
    const state = store.getState().form.userDetails;
    expect(state.selectedDriver).toEqual(driver);
  });

  it("should handle fetchDrivers.pending", () => {
    store.dispatch({ type: fetchDrivers.pending.type });
    const state = store.getState().form;
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it("should handle fetchDrivers.fulfilled", () => {
    const mockDrivers = [
      { driverId: "hamilton", givenName: "Lewis", familyName: "Hamilton" },
    ];
    store.dispatch({ type: fetchDrivers.fulfilled.type, payload: mockDrivers });
    const state = store.getState().form;
    expect(state.loading).toBe(false);
  });

  it("should handle fetchDrivers.rejected", () => {
    store.dispatch({
      type: fetchDrivers.rejected.type,
      payload: "Error fetching drivers",
    });
    const state = store.getState().form;
    expect(state.loading).toBe(false);
    expect(state.error).toBe("Error fetching drivers");
  });

  it("should handle fetchDrivers.rejected with a non-string payload", () => {
    store.dispatch({
      type: fetchDrivers.rejected.type,
      payload: "An unknown error occurred.",
    });
    const state = store.getState().form;
    expect(state.loading).toBe(false);
    expect(state.error).toBe("An unknown error occurred.");
  });

  it("should handle fetchDrivers.rejected with a non-string rejection message", async () => {
    const errorResponse = { someError: "Unexpected error" };
    axios.get = jest.fn().mockRejectedValueOnce(errorResponse);

    await store.dispatch(fetchDrivers());

    const state = store.getState().form;

    expect(state.loading).toBe(false);
    expect(state.error).toBe("Failed to fetch data. Please try again later.");
  });

  it("should handle fetchDriverStandings.fulfilled", () => {
    const mockStandings = [{ position: "1", driverId: "verstappen" }];
    store.dispatch({
      type: fetchDriverStandings.fulfilled.type,
      payload: mockStandings,
    });
    const state = store.getState().form;
    expect(state.loading).toBe(false);
    expect(state.driverStandings).toEqual(mockStandings);
  });

  it("should handle fetchDriverStandings.rejected", () => {
    store.dispatch({
      type: fetchDriverStandings.rejected.type,
      payload: "Error fetching standing",
    });
    const state = store.getState().form;
    expect(state.loading).toBe(false);
    expect(state.error).toBe("Error fetching standing");
  });

  it("should handle fetchDriverStandings.rejected with a non-string payload", () => {
    store.dispatch({
      type: fetchDriverStandings.rejected.type,
      payload: "An unknown error occurred.",
    });
    const state = store.getState().form;
    expect(state.loading).toBe(false);
    expect(state.error).toBe("An unknown error occurred.");
  });

  it("should handle fetchDriverStandings.rejected with a non-string error", async () => {
    const errorResponse = { someError: "Unexpected error" }; // Non-standard error object
    axios.get = jest.fn().mockRejectedValueOnce(errorResponse); // Mock API rejection

    await store.dispatch(fetchDriverStandings()); // Dispatch async thunk

    const state = store.getState().form;

    expect(state.loading).toBe(false);
    expect(state.error).toBe("Failed to fetch data. Please try again later."); // Default fallback error
  });

  it("should correctly dispatch fetchDrivers and update state", async () => {
    const mockDrivers = [
      { driverId: "hamilton", givenName: "Lewis", familyName: "Hamilton" },
    ];
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { MRData: { DriverTable: { Drivers: mockDrivers } } },
    });

    await store.dispatch(fetchDrivers());

    const state = store.getState().form;
    expect(state.loading).toBe(false);
  });

  it("should correctly dispatch fetchDriverStandings and update state", async () => {
    const mockStandings = [{ position: "1", driverId: "verstappen" }];
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        MRData: {
          StandingsTable: {
            StandingsLists: [{ DriverStandings: mockStandings }],
          },
        },
      },
    });

    await store.dispatch(fetchDriverStandings());

    const state = store.getState().form;
    expect(state.loading).toBe(false);
    expect(state.driverStandings).toEqual(mockStandings);
  });
});
