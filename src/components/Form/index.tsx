import { Box, StepLabel, Stepper } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  DRIVER_REQUIRED,
  EMAIL_REQUIRED,
  NAME_REQUIRED,
} from "constant/ErrorMessage";
import { STEPS, STEPS_FOR_NAVIGATION } from "constant/TitleText";
import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "app/store";
import CommonButton from "components/Button/index";
import {
  AnimatedStep,
  StyledContainer,
  StyledPaper,
} from "components/Form/index.style";
import { setStep, setValidationErrors } from "../../redux/form/formSlice";
import { validationErrorObject } from "redux/form/types";
import BasicInfo from "components/Form/steps/BasicInfo";
import DriverSelection from "components/Form/steps/DriverSelection";
import SummaryStep from "components/Form/steps/Summary";
import { useNavigate } from "react-router-dom";

/**
 * Form component for a multi-step form.
 * Handles navigation, validation, and rendering of different form steps.
 */
const Form: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width:400px)");
  const { step, userDetails, validationError } = useSelector(
    (state: RootState) => state.form
  );
  const { name, email, selectedDriver } = userDetails;
  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);

  /**
   * Validates the required fields (name, email, and driver selection).
   * Dispatches a `setValidationErrors` action to update the validation error state.
   * @returns {boolean} True if validation passes, false otherwise.
   */
  const validateFields = useCallback(() => {
    const errors: validationErrorObject = {};
    if (!name?.trim()) {
      errors.name = NAME_REQUIRED;
    }
    if (!email || !emailRegex.test(email)) {
      errors.email = EMAIL_REQUIRED;
    }
    if (step === 2 && (!selectedDriver || !selectedDriver?.driverId?.trim())) {
      errors.selectDriver = DRIVER_REQUIRED;
    }
    dispatch(setValidationErrors({ ...validationError, ...errors }));
    // Return true if NO errors, false otherwise.
    return Object.keys(errors).length === 0;
  }, [dispatch, email, name, selectedDriver, step, validationError]);

  /**
   * Handles clicks on the step labels in the Stepper.
   * Navigates to the clicked step if validation passes.
   * @param {string} clickedStep - The label of the clicked step.
   */
  const handleStepClick = useCallback(
    (clickedStep: string) => {
      const stepIndex = STEPS.indexOf(clickedStep); // Get index for setting step
      if (stepIndex === -1 || !validateFields()) return;
      dispatch(setStep(stepIndex + 1));
      const routeName = STEPS_FOR_NAVIGATION[stepIndex];
      navigate(`/${routeName}`, {
        replace: true,
        state: {
          userDetails,
        },
      });
    },
    [navigate, STEPS, validateFields]
  );

  /**
   * Renders different content based on the current step.
   * Uses useMemo to memoize the rendered component for performance.
   * This function returns different JSX components for each step in the multi-step process:
   * - **Step 1**: Renders the "Name" and "Email" input fields.
   * - **Step 2**: Renders a loading spinner, an error alert, or a driver selection dropdown.
   * - **Step 3**: Displays a summary of the entered information, including driver details and standings.
   *
   * Returns:
   * - JSX: The JSX for the step content, including inputs, loading indicators, or summary details.
   */
  const renderStep = useMemo(() => {
    switch (step) {
      case 1:
        return <BasicInfo />;
      case 2:
        return <DriverSelection />;
      case 3:
        return <SummaryStep />;
      default:
        return null;
    }
  }, [step]);
  /**
   * Memoizes the Stepper steps for performance.
   * Only re-renders when handleStepClick changes.
   * @returns {JSX.Element[]} An array of AnimatedStep components.
   */
  const steps = useMemo(() => {
    // Memoize the steps array
    return STEPS.map((label) => (
      <AnimatedStep key={label} onClick={() => handleStepClick(label)}>
        <StepLabel>{label}</StepLabel>
      </AnimatedStep>
    ));
  }, [handleStepClick]); // Only re-render when handleStepClick changes

  return (
    <StyledContainer>
      <StyledPaper elevation={3}>
        {/* Stepper to navigate between steps */}
        <Stepper
          activeStep={step - 1}
          sx={{ mb: 4 }}
          orientation={isSmallScreen ? "vertical" : "horizontal"}
        >
          {steps}
          {/* Render memoized steps */}
        </Stepper>
        {/* Container for the current step */}
        <div data-testid="form-container">{renderStep && renderStep}</div>
        {/* Button container */}
        <Box display={"flex"} justifyContent={"space-around"}>
          {/* CommonButton component for Next/Back actions */}
          <CommonButton validateFields={validateFields} />
        </Box>
      </StyledPaper>
    </StyledContainer>
  );
};

export default Form;
