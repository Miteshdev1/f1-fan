import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "app/store";
import { Driver, DriverStanding } from "../../../../redux/form/types";
import { motion } from "framer-motion";
import { motionDivProps, StyledBox } from "components/Form/index.style";
import {
  Box,
  CircularProgress,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import {
  BASIC_INFORMATION,
  CODE,
  CURRENT_STANDING,
  DRIVER_DETAILS,
  EMAIL,
  NAME,
  NUMBER,
  POINTES,
  SUMMARY,
} from "constant/TitleText";
import { fetchDriverStandings } from "../../../../redux/form/formSlice";
/**
 * @component SummaryStep
 * @description This component displays a summary of the user's information and the selected driver's details, including their current standings.
 */
const SummaryStep: React.FC = () => {
  // Accesses the user details, loading state, and driver standings from the Redux store.
  const { userDetails, loading, driverStandings, step } = useSelector(
    (state: RootState) => state.form
  );
  const dispatch = useDispatch<AppDispatch>();
  const driversFetchedRef = useRef(false); // Use a ref
  useEffect(() => {
    if (
      driverStandings &&
      driverStandings.length === 0 &&
      !loading &&
      step === 3 &&
      !driversFetchedRef.current
    ) {
      dispatch(fetchDriverStandings());
      driversFetchedRef.current = true;
    }
  }, [driverStandings, loading, step]);

  // Destructures the necessary information from the userDetails object.
  const { name, email, selectedDriver } = userDetails;
  /**
   * @function getDriverStanding
   * @description Finds and returns the driver standing information for a given driver.
   * @param {Driver} driver - The driver object to find the standing for.
   * @returns {DriverStanding | undefined} - The driver standing object, or undefined if not found.
   */
  const getDriverStanding = (driver: Driver): DriverStanding | undefined => {
    return driverStandings?.find(
      (standing) => standing.Driver.driverId === driver.driverId
    );
  };
  // Memoize the driver standing retrieval for performance (if driverStandings doesn't change frequently)
  const memoizedGetDriverStanding = React.useMemo(
    () => getDriverStanding,
    [driverStandings]
  );
  // Helper function to render driver details (reduces JSX duplication)
  const renderDriverDetails = (driver: Driver) => (
    <Paper elevation={0} sx={{ mt: 2, borderRadius: 2 }}>
      <Box mt={2}>
        <Typography variant="h6">{DRIVER_DETAILS}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography>
          {NAME}: {driver.givenName} {driver.familyName}
        </Typography>
        <Typography>
          {NUMBER}: {driver.permanentNumber}
        </Typography>
        <Typography>
          {CODE}: {driver.code}
        </Typography>
        {driverStandings && (
          <>
            <Typography>
              {CURRENT_STANDING}: {memoizedGetDriverStanding(driver)?.position}
            </Typography>
            <Typography>
              {POINTES}: {memoizedGetDriverStanding(driver)?.points}
            </Typography>
          </>
        )}
      </Box>
    </Paper>
  );
  return (
    <motion.div {...motionDivProps}>
      {/* Summary Title */}
      <Typography data-testid="summary-title" variant="h4" gutterBottom>
        {SUMMARY}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {/* Basic Information Section */}
      <Typography variant="h6">{BASIC_INFORMATION}</Typography>
      <Typography>
        {NAME}: {name}
      </Typography>
      <Typography>
        {EMAIL}: {email}
      </Typography>
      {/* Loading Indicator */}
      {loading && (
        <StyledBox>
          <CircularProgress />
        </StyledBox>
      )}
      {/* Conditionally render driver details */}
      {selectedDriver && !loading && renderDriverDetails(selectedDriver)}
    </motion.div>
  );
};

export default SummaryStep;
