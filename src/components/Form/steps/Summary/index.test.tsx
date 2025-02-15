import { render, screen } from "@testing-library/react";
import { RootState } from "app/store";
import {
  CURRENT_STANDING,
  DRIVER_DETAILS,
  EMAIL,
  NAME,
  POINTES,
  SUMMARY,
} from "constant/TitleText";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { DriverStanding } from "redux/form/types";
import SummaryStep from ".";

// Mock Redux store
const mockStore = configureStore<RootState[]>([]);

const renderComponent = (customState?: any) => {
  const initialState = {
    form: {
      userDetails: {
        name: "John Doe",
        email: "john.doe@example.com",
        selectedDriver: {
          driverId: "1",
          givenName: "Lewis",
          familyName: "Hamilton",
          permanentNumber: "44",
          code: "HAM",
        },
      },
      driverStandings: [
        {
          position: "1",
          points: "200",
          Driver: { driverId: "1" },
        } as DriverStanding,
      ],
      loading: false,
      ...customState?.form,
    },
  };

  const store = mockStore(initialState);

  return render(
    <Provider store={store}>
      <SummaryStep />
    </Provider>
  );
};

describe("SummaryStep Component", () => {
  test("renders summary title", () => {
    renderComponent();

    expect(screen.getByText(SUMMARY)).toBeInTheDocument();
  });

  test("renders user name and email", () => {
    renderComponent();

    expect(screen.getByText(`${NAME}: John Doe`)).toBeInTheDocument();
    expect(
      screen.getByText(`${EMAIL}: john.doe@example.com`)
    ).toBeInTheDocument();
  });

  test("renders loading indicator when loading", () => {
    renderComponent({ form: { loading: true } });

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("does not show driver details when no driver is selected", () => {
    renderComponent({ form: { userDetails: { selectedDriver: null } } });

    expect(screen.queryByText(DRIVER_DETAILS)).not.toBeInTheDocument();
  });

  test("renders selected driver details", () => {
    renderComponent();

    expect(screen.getByText(DRIVER_DETAILS)).toBeInTheDocument();
    expect(screen.getByText(`${NAME}: Lewis Hamilton`)).toBeInTheDocument();
    expect(screen.getByText(`${CURRENT_STANDING}: 1`)).toBeInTheDocument();
    expect(screen.getByText(`${POINTES}: 200`)).toBeInTheDocument();
  });

  test("does not show standings when driver standings are empty", () => {
    renderComponent({ form: { driverStandings: [] } });

    expect(screen.queryByText(CURRENT_STANDING)).not.toBeInTheDocument();
    expect(screen.queryByText(POINTES)).not.toBeInTheDocument();
  });
});
