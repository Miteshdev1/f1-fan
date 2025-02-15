import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "app/store";
import {
  setBasicInfo,
  setValidationErrors,
} from "../../../../redux/form/formSlice";
import { motion } from "framer-motion";
import CustomTextField from "components/TextField/index";
import { motionDivProps } from "components/Form/index.style";
import { EMAIL, NAME } from "constant/TitleText";
/**
 * BasicInfo component for collecting user's name and email.
 * This component uses Redux for state management and memoization for performance.
 */
const BasicInfo: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userDetails, validationError } = useSelector(
    (state: RootState) => state.form
  );
  /**
   * Handles changes to the basic information fields (name, email).
   * Updates the Redux state and clears any validation errors for the changed field.
   * @param event - The change event from the input field.
   */
  const handleBasicInfoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    // Reset any previous error message for the specific input field
    dispatch(setValidationErrors({ ...validationError, [name]: "" }));
    // Update the user details in the Redux store.
    dispatch(setBasicInfo({ ...userDetails, [name]: value }));
  };
  /**
   * Memoized input field for the user's name.
   * Prevents unnecessary re-renders of the input field.
   */
  const nameField = React.useMemo(
    () => (
      <CustomTextField
        label={NAME}
        name="name"
        value={userDetails.name}
        onChange={handleBasicInfoChange}
        error={validationError.name}
        required
      />
    ),
    [userDetails.name, validationError.name, handleBasicInfoChange]
  );
  /**
   * Memoized input field for the user's email.
   * Prevents unnecessary re-renders of the input field.
   */
  const emailField = React.useMemo(
    () => (
      <CustomTextField
        label={EMAIL}
        name="email"
        value={userDetails.email}
        onChange={handleBasicInfoChange}
        error={validationError.email}
        required
      />
    ),
    [userDetails.email, validationError.email, handleBasicInfoChange]
  );

  return (
    <motion.div {...motionDivProps}>
      {nameField}
      {emailField}
    </motion.div>
  );
};

export default BasicInfo;
