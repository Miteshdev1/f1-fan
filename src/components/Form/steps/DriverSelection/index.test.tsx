import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { AppStore } from "app/store";
import DriverSelection from ".";
import { setValidationErrors, selectDriver } from "redux/form/formSlice";

jest.mock("redux/form/formSlice", () => ({
  setValidationErrors: jest.fn(),
  selectDriver: jest.fn(),
}));

const mockStore = configureStore([]);

describe("DriverSelection Component", () => {
  let store: AppStore;
  const renderComponent = (customState?: any) => {
    const initialState = {
      form: {
        userDetails: { selectedDriver: null },
        driversList: [
          { driverId: "1", givenName: "Lewis", familyName: "Hamilton" },
          { driverId: "2", givenName: "Max", familyName: "Verstappen" },
        ],
        loading: false,
        error: null,
        validationError: { selectDriver: "" },
        ...customState?.form,
      },
    };

    store = mockStore(initialState);
    store.dispatch = jest.fn();

    return render(
      <Provider store={store}>
        <DriverSelection />
      </Provider>
    );
  };

  test("Should show loader when loading is true", () => {
    renderComponent({ form: { loading: true } });
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("Should show select input when loading is false", () => {
    renderComponent();

    expect(screen.getByLabelText("Select Driver*")).toBeInTheDocument();
  });

  test("Should show error message when no driver is selected", () => {
    renderComponent({
      form: {
        validationError: { selectDriver: "Driver selection is required" },
      },
    });

    expect(
      screen.getByText("Driver selection is required")
    ).toBeInTheDocument();
  });

  test("Should remove error when a valid driver is selected", () => {
    renderComponent();

    fireEvent.mouseDown(screen.getByLabelText("Select Driver*"));
    fireEvent.click(screen.getByText("Lewis Hamilton"));

    expect(setValidationErrors).toHaveBeenCalledWith({ selectDriver: "" });
    expect(selectDriver).toHaveBeenCalledWith({
      driverId: "1",
      givenName: "Lewis",
      familyName: "Hamilton",
    });
  });

  test("Should show available driver options when select is clicked", () => {
    renderComponent();

    fireEvent.mouseDown(screen.getByLabelText("Select Driver*"));

    expect(screen.getByText("Lewis Hamilton")).toBeInTheDocument();
    expect(screen.getByText("Max Verstappen")).toBeInTheDocument();
  });

  test("Should show an error alert when there is an error", () => {
    renderComponent({ form: { error: "Failed to load drivers" } });

    expect(screen.getByText("Failed to load drivers")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
