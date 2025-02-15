import { render, screen } from "@testing-library/react";
import App from "./App";
import { Provider } from "react-redux"; // Import Provider
import { store } from "./app/store"; // Import your store
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter

describe("App Component", () => {
  test("renders main page on / route", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText("Basic Info")).toBeInTheDocument();
  });
});
