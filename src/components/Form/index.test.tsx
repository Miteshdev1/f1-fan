import { useMediaQuery } from "@mui/material";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AppStore } from "app/store";
import {
  DRIVER_REQUIRED,
  EMAIL_REQUIRED,
  NAME_REQUIRED,
} from "constant/ErrorMessage";
import { BASIC_INFO, DRIVER_SELECTION, SUMMARY } from "constant/TitleText";
import { act } from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import {
  fetchDriverStandings,
  setStep,
  setValidationErrors,
} from "redux/form/formSlice";
import Form from ".";

jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  useMediaQuery: jest.fn(),
}));

jest.mock("redux/form/formSlice", () => ({
  setStep: jest.fn(),
  fetchDriverStandings: jest.fn(),
  setValidationErrors: jest.fn(),
  fetchDrivers: jest.fn().mockResolvedValue({}),
}));

const mockStore = configureStore([]);

describe("Form Component", () => {
  let store: AppStore;
  const renderComponent = (customState?: any) => {
    const initialState = {
      form: {
        step: 1,
        userDetails: { name: "", email: "", selectedDriver: null },
        validationError: {},
        loading: false,
        ...customState?.form,
      },
    };

    store = mockStore(initialState);
    store.dispatch = jest.fn();

    return render(
      <Provider store={store}>
        <MemoryRouter>
          <Form />
        </MemoryRouter>
      </Provider>
    );
  };

  test("renders Stepper in the component", () => {
    renderComponent();
    const stepper = document.querySelector(".MuiStepper-root");
    expect(stepper).toBeInTheDocument();
  });

  test("renders all step labels", () => {
    renderComponent();
    expect(screen.getByText(BASIC_INFO)).toBeInTheDocument();
    expect(screen.getByText(DRIVER_SELECTION)).toBeInTheDocument();
    expect(screen.getByText(SUMMARY)).toBeInTheDocument();
  });

  test("handles step click correctly and navigates", async () => {
    renderComponent();

    const driverSelectionStep = screen.getByText(DRIVER_SELECTION);
    fireEvent.click(driverSelectionStep);
    await waitFor(() =>
      expect(store.dispatch).toHaveBeenCalledWith(setStep(2))
    );
    expect(store.dispatch).toHaveBeenCalledWith(setStep(2));

    const summaryStep = screen.getByText(SUMMARY);
    fireEvent.click(summaryStep);
    await waitFor(() =>
      expect(store.dispatch).toHaveBeenCalledWith(setStep(3))
    );
    expect(store.dispatch).toHaveBeenCalledWith(setStep(3));
    expect(store.dispatch).toHaveBeenCalledWith(fetchDriverStandings());
  });

  test("renders Stepper in horizontal mode on large screens", () => {
    (useMediaQuery as jest.Mock).mockReturnValue(false);
    renderComponent();

    const stepper = document.querySelector(".MuiStepper-root");
    expect(stepper).toHaveClass("MuiStepper-horizontal");
  });

  test("renders BasicInfo when step is 1", () => {
    renderComponent({ form: { step: 1 } });
    expect(screen.getByRole("textbox", { name: /name/i })).toBeInTheDocument();
  });

  test("renders DriverSelection when step is 2", () => {
    renderComponent({
      form: {
        step: 2,
        driversList: [
          {
            driverId: "test",
            permanentNumber: "test",
            code: "test",
            url: "test",
            givenName: "test",
            familyName: "test",
            dateOfBirth: "test",
            nationality: "test",
          },
        ],
        loading: false,
      },
    });
    expect(
      screen.getByRole("combobox", { name: /select driver\*/i })
    ).toBeInTheDocument();
  });

  test("renders SummaryStep when step is 3", () => {
    renderComponent({ form: { step: 3 } });
    expect(screen.getByTestId("summary-title")).toBeInTheDocument();
  });

  test("renders nothing for an invalid step", () => {
    renderComponent({ form: { step: 99 } });

    expect(screen.queryByText("Name")).not.toBeInTheDocument();
    expect(screen.queryByText("Select Driver*")).not.toBeInTheDocument();

    const container = screen.getByTestId("form-container");
    expect(container).toBeEmptyDOMElement();
  });

  test("handleStepClick does not dispatch action when clickedStep is invalid", async () => {
    renderComponent();
    const handleStepClick = jest.fn();
    await act(async () => {
      await handleStepClick("Invalid Step");
    });

    expect(setStep).not.toHaveBeenCalled();
    expect(fetchDriverStandings).not.toHaveBeenCalled();
  });

  test("validateFields sets validation errors when fields are missing", () => {
    renderComponent({
      form: {
        step: 1,
        userDetails: { name: "", email: "", selectedDriver: null },
        validationError: {},
      },
    });

    const nextButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextButton);

    expect(store.dispatch).toHaveBeenCalledWith(
      setValidationErrors({
        name: NAME_REQUIRED,
        email: EMAIL_REQUIRED,
      })
    );
  });

  test("validateFields sets an email error for invalid email format", () => {
    renderComponent({
      form: {
        step: 1,
        userDetails: {
          name: "John Doe",
          email: "invalid-email",
          selectedDriver: null,
        },
        validationError: {},
      },
    });
    const nextButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextButton);
    expect(store.dispatch).toHaveBeenCalledWith(
      setValidationErrors({
        email: EMAIL_REQUIRED,
      })
    );
  });

  test("validateFields sets a driver selection error when no driver is selected", () => {
    renderComponent({
      form: {
        step: 2,
        userDetails: {
          name: "John Doe",
          email: "john@example.com",
          selectedDriver: null,
        },
        validationError: {},
      },
    });

    const nextButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextButton);

    expect(store.dispatch).toHaveBeenCalledWith(
      setValidationErrors({
        selectDriver: DRIVER_REQUIRED,
      })
    );
  });

  test("validateFields sets a driver selection error when selectedDriver is an empty object", () => {
    renderComponent({
      form: {
        step: 2,
        userDetails: {
          name: "John Doe",
          email: "john@example.com",
          selectedDriver: {},
        },
        validationError: {},
      },
    });

    const nextButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextButton);
    expect(store.dispatch).toHaveBeenCalledWith(
      setValidationErrors({
        selectDriver: DRIVER_REQUIRED,
      })
    );
  });
});
