import React from "react";
import { StyledTextField } from "components/TextField/index.style";
import { CommonTextFieldProps } from "app/types";
/**
 * CommonTextField component renders a text input field with validation/error handling and optional label.
 *
 * Props:
 * - label (string): The label text that will be displayed above the text field.
 * - name (string): The unique name of the input field, typically used for form handling or validation.
 * - value (string): The current value of the input field, this will be controlled by the parent component.
 * - onChange (function): The function that will be called when the value of the input field changes.
 * - error (string | undefined): The error message that will be displayed below the text field if there's any validation error.
 * - required (boolean, optional): Specifies if the field is mandatory (default is 'false' if not passed).
 */
const CommonTextField: React.FC<CommonTextFieldProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
}) => {
  return (
    <StyledTextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      fullWidth
      margin="normal"
      error={!!error}
      helperText={error}
    />
  );
};

export default CommonTextField;
