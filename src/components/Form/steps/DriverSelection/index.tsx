import {
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";
import { SelectChangeEvent } from "@mui/material/Select";
import { AppDispatch, RootState } from "app/store";
import {
  StyledBox,
  commonMenuProps,
  motionDivProps,
} from "components/Form/index.style";
import { DRIVER_REQUIRED } from "constant/ErrorMessage";
import { SELECT_DRIVER } from "constant/TitleText";
import { motion } from "framer-motion";
import React, { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { validationErrorObject } from "redux/form/types";
import {
  fetchDrivers,
  selectDriver,
  setValidationErrors,
} from "../../../../redux/form/formSlice";

/**
 * @description This component renders a dropdown for selecting a driver.
 * It fetches the list of drivers from the Redux store and allows the user to select one.
 * It also handles validation and dispatches actions to update the selected driver
 * and validation errors in the Redux store.
 */
const DriverSelection: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userDetails, loading, error, driversList, validationError, step } =
    useSelector((state: RootState) => state.form);
  const driversFetchedRef = useRef(false);
  useEffect(() => {
    if (
      driversList?.length === 0 &&
      !loading &&
      step === 2 &&
      !driversFetchedRef.current
    ) {
      dispatch(fetchDrivers());
      driversFetchedRef.current = true;
    }
  }, [driversList, loading, step]);
  /**
   * @description Memoized drivers list for performance optimization. This prevents
   * the list from being re-rendered unnecessarily if the `driversList` prop hasn't changed.
   */
  const memoizedDrivers = useMemo(() => driversList, [driversList]);
  /**
   * @description Handles the selection of a driver from the dropdown.
   * @param {SelectChangeEvent<string>} event - The event object from the Select component.
   */
  const handleDriverSelect = (event: SelectChangeEvent<string>) => {
    const selectedDriverId = event.target.value;
    const errors: validationErrorObject = { ...validationError };

    const selectedDriver =
      memoizedDrivers?.find((driver) => driver.driverId === selectedDriverId) ||
      null;
    // Validate if a driver is selected
    if (!selectedDriver) {
      errors.selectDriver = DRIVER_REQUIRED;
    } else {
      errors.selectDriver = "";
    }
    // Dispatch actions to update validation errors and selected driver
    dispatch(setValidationErrors(errors));
    dispatch(selectDriver(selectedDriver));
  };
  const selectedDriverId = userDetails.selectedDriver?.driverId || "";
  return (
    <>
      {/* Loading state */}
      {loading && (
        <StyledBox>
          <CircularProgress />
        </StyledBox>
      )}
      {error && (
        // Error state
        <Alert severity="error">{error}</Alert>
      )}
      {memoizedDrivers?.length > 0 && (
        // Success state - render the driver selection dropdown
        <motion.div {...motionDivProps}>
          <FormControl
            fullWidth
            margin="normal"
            error={Boolean(validationError.selectDriver)} // Error state
          >
            <InputLabel id="driver-select-label">{SELECT_DRIVER}*</InputLabel>
            <Select
              labelId="driver-select-label"
              id="driver-select"
              value={selectedDriverId}
              label={SELECT_DRIVER}
              onChange={handleDriverSelect}
              error={Boolean(validationError.selectDriver)}
              MenuProps={commonMenuProps}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: validationError.selectDriver ? "#d32f2f" : "",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: validationError.selectDriver ? "#d32f2f" : "",
                },
              }}
            >
              {/* Map through drivers list to render options */}
              {memoizedDrivers?.map((standing) => (
                <MenuItem key={standing.driverId} value={standing.driverId}>
                  {standing.givenName} {standing.familyName}
                </MenuItem>
              ))}
            </Select>
            {/* Display validation error message */}
            {validationError.selectDriver && (
              <FormHelperText sx={{ marginLeft: "0px" }}>
                {validationError.selectDriver}
              </FormHelperText>
            )}
          </FormControl>
        </motion.div>
      )}
    </>
  );
};

export default DriverSelection;
