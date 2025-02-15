import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import CommonButton from ".";
import { setStep } from "../../redux/form/formSlice";
import { AppStore } from "app/store";

jest.mock("../../redux/form/formSlice", () => ({
  setStep: jest.fn(),
  fetchDrivers: jest.fn(),
  fetchDriverStandings: jest.fn(),
}));

const mockStore = configureStore([]);
const mockValidateFields = jest.fn();
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

let store: AppStore;

const renderComponent = (customState?: any) => {
  const initialState = {
    form: {
      step: 1,
      driversList: [],
      loading: false,
      validationError: null,
      ...customState?.form,
    },
  };

  store = mockStore(initialState);
  store.dispatch = jest.fn();

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <CommonButton validateFields={mockValidateFields} />
      </MemoryRouter>
    </Provider>
  );
};

afterEach(() => {
  jest.clearAllMocks();
});

describe("CommonButton Component", () => {
  test("Shows 'Back' button when step > 1", () => {
    renderComponent({ form: { step: 2 } });
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
  });

  test("Displays next button when step is 1 or 2 ", () => {
    renderComponent({ form: { step: 1 } });
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });

  test("Calls handleBack when 'Back' button is clicked", () => {
    renderComponent({ form: { step: 2 } });
    fireEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(setStep).toHaveBeenCalledWith(1);
    expect(store.dispatch).toHaveBeenCalledWith(setStep(1));
  });

  test("handleNext() - Returns early if validation fails", () => {
    mockValidateFields.mockReturnValue(false);
    renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(mockValidateFields).toHaveBeenCalled();
    expect(setStep).not.toHaveBeenCalled();
  });

  test("handleNext() - Increments step when valid", () => {
    mockValidateFields.mockReturnValue(true);
    renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(mockValidateFields).toHaveBeenCalled();
    expect(setStep).toHaveBeenCalledWith(2);
    expect(store.dispatch).toHaveBeenCalledWith(setStep(2));
  });
});
