export interface CommonTextFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
}

export interface CommonButtonProps {
  validateFields: () => void | boolean;
}
