import { fireEvent, render, screen } from "@testing-library/react";
import CommonTextField from ".";

describe("CommonTextField Component", () => {
  const mockOnChange = jest.fn();

  test("renders CommonTextField with correct label and value", () => {
    render(
      <CommonTextField
        label="Test Label"
        name="test"
        value="Test Value"
        onChange={mockOnChange}
      />
    );
    const labelElement = screen.getByLabelText("Test Label");
    expect(labelElement).toBeInTheDocument();
    const inputElement = screen.getByRole("textbox", {
      name: /test label/i,
    }) as HTMLInputElement; // More robust query
    expect(inputElement).toBeInTheDocument();
    expect(inputElement.value).toBe("Test Value");
  });

  test("calls onChange when input value changes", () => {
    render(
      <CommonTextField
        label="Test Label"
        name="test"
        value=""
        onChange={mockOnChange}
      />
    );
    const inputElement = screen.getByRole("textbox", { name: /test label/i });
    fireEvent.change(inputElement, { target: { value: "New Value" } });
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  test("displays error message when error prop is provided", () => {
    render(
      <CommonTextField
        label="Test Label"
        name="test"
        value=""
        onChange={mockOnChange}
        error="This is an error"
      />
    );
    expect(screen.queryByText("This is an error")).toBeInTheDocument();
  });
});
