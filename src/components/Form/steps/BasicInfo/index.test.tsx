import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import BasicInfo from ".";
import { AppStore } from "app/store";
import { setBasicInfo, setValidationErrors } from "redux/form/formSlice";
const mockStore = configureStore([]);
jest.mock("redux/form/formSlice", () => ({
  setValidationErrors: jest.fn(),
  setBasicInfo: jest.fn(),
}));
describe("BasicInfo Component", () => {
  let store: AppStore;
  beforeEach(() => {
    store = mockStore({
      form: {
        userDetails: { name: "", email: "", selectedDriver: null },
        validationError: { name: "", email: "", selectDriver: "" },
      },
    });
    store.dispatch = jest.fn();
    render(
      <Provider store={store}>
        <BasicInfo />
      </Provider>
    );
  });
  test("renders BasicInfo component", () => {
    expect(screen.getByRole("textbox", { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
  });
  test("updates input fields and dispatches actions", () => {
    const nameInput = screen.getByRole("textbox", { name: /name/i });
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    expect(store.dispatch).toHaveBeenNthCalledWith(
      1,
      setValidationErrors({ name: "", email: "" })
    );
    expect(store.dispatch).toHaveBeenNthCalledWith(
      2,
      setBasicInfo({ name: "John Doe", email: "john@example.com" })
    );
  });
});
