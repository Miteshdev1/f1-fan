import { useDispatch } from "react-redux";
import { Routes, Route, useLocation } from "react-router-dom";
import Form from "components/Form";
import { useEffect, useMemo } from "react";
import { STEPS_FOR_NAVIGATION } from "constant/TitleText";
import { selectDriver, setBasicInfo, setStep } from "./redux/form/formSlice";
function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  // Memoize the current step based on the URL path. This prevents recalculations
  // unless the pathname changes.  Handles the root path case ("/") correctly.
  const currentStep = useMemo(() => {
    const pathParts = location.pathname.split("/");
    const route = pathParts.pop() || ""; // Default to empty string for root path
    return STEPS_FOR_NAVIGATION.indexOf(route) + 1 || 1; // Default to 1 if route not found
  }, [location.pathname]); // Only recalculate when pathname changes

  // Memoize user details from location state. Prevents recalculations unless
  // the location state changes.
  const userDetails = useMemo(
    () => location.state?.userDetails,
    [location.state]
  ); // Memoize userDetails

  useEffect(() => {
    // Set the current step in the Redux store.
    dispatch(setStep(currentStep));
    // Set basic user information in the Redux store.
    dispatch(setBasicInfo(userDetails));
    // If a driver is selected, update the Redux store.
    if (userDetails?.selectedDriver?.driverId) {
      dispatch(selectDriver(userDetails.selectedDriver));
    }
    // The useEffect hook now depends on currentStep and userDetails, ensuring it runs
    // when either of these values change. This is crucial for keeping the application
    // state synchronized with the route and location state.
  }, [dispatch, currentStep, userDetails]);

  return (
    <Routes>
      <Route path="/" element={<Form />} />
      {/* Dynamically generate routes based on STEPS_FOR_NAVIGATION. This makes it
          easier to add or remove steps without having to manually update the routes. */}
      {STEPS_FOR_NAVIGATION.map((route) => (
        <Route key={route} path={`/${route}`} element={<Form />} />
      ))}
    </Routes>
  );
}

export default App;
