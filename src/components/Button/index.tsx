import React, { useMemo } from "react";
import { Button } from "@mui/material";
import { StyledButtonContainer } from "./index.style";
import { CommonButtonProps } from "app/types";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "app/store";
import {
  setStep,
  setBasicInfo,
  selectDriver,
  clearForm,
} from "../../redux/form/formSlice";
import { useNavigate } from "react-router-dom";
import {
  BACK_BUTTON,
  CLEAR_BUTTON,
  NEXT_BUTTON,
  STEPS_FOR_NAVIGATION,
} from "constant/TitleText";
/**
 * CommonButton component renders navigation buttons for multi-step forms.
 *
 * Props:
 * - validateFields (function): A function that will be check validations.
 */
const CommonButton: React.FC<CommonButtonProps> = ({ validateFields }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    step,
    userDetails,
    loading: isLoading,
  } = useSelector((state: RootState) => state.form);
  /**
   * Handles the "Next" button click.
   * Validates the form fields and navigates to the next step.
   */
  const handleNext = () => {
    const isValid = validateFields();
    if (!isValid) return; // Exit early if validation fails
    const nextStep = step === STEPS_FOR_NAVIGATION.length ? step : step + 1;
    // Increment the step and dispatch it
    dispatch(setStep(nextStep));
    const routeName = STEPS_FOR_NAVIGATION[step];
    navigate(`/${routeName}`, {
      replace: true,
      state: {
        userDetails,
      },
    });
  };
  /**
   * Handles the "Back" button click.
   * Navigates to the previous step.
   */
  const handleBack = () => {
    const prevStep = step - 1;
    dispatch(setStep(prevStep));
    const routeName = STEPS_FOR_NAVIGATION[prevStep - 1];
    navigate(`/${routeName}`, {
      replace: true,
      state: {
        userDetails,
      },
    });
  };
  const initialUserDetails = useMemo(
    () => ({ name: "", email: "", selectedDriver: { driverId: "" } }),
    []
  );
  /**
   * Handles the "Clear" button click.
   * Resets the form and navigates to the first step.
   */
  const handleClear = () => {
    dispatch(setStep(1));
    const routeName = STEPS_FOR_NAVIGATION[0];
    navigate(`/${routeName}`, {
      replace: true,
      state: {
        userDetails: initialUserDetails,
      },
    });
    dispatch(clearForm());
  };
  // Memoize button visibility based on the current step
  const showBackButton = useMemo(() => step > 1, [step]);
  const showNextButton = useMemo(
    () => step < STEPS_FOR_NAVIGATION.length,
    [step]
  );
  const showClearButton = useMemo(
    () => step === STEPS_FOR_NAVIGATION.length,
    [step]
  );

  return (
    <StyledButtonContainer step={step}>
      {/* Conditionally render buttons using fragments and keys for efficient updates */}
      {showBackButton && (
        <Button variant="contained" onClick={handleBack}>
          {BACK_BUTTON}
        </Button>
      )}
      {showNextButton && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          disabled={isLoading}
        >
          {NEXT_BUTTON}
        </Button>
      )}
      {showClearButton && (
        <Button variant="contained" color="primary" onClick={handleClear}>
          {CLEAR_BUTTON}
        </Button>
      )}
    </StyledButtonContainer>
  );
};

export default CommonButton;
