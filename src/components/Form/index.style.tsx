import { Step, styled, Box, Paper } from "@mui/material";

export const AnimatedStep = styled(Step)(() => ({
  cursor: "pointer",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
  "&.active": {
    animation: "pulse 0.5s infinite alternate",
  },
  "@keyframes pulse": {
    from: { transform: "scale(1)" },
    to: { transform: "scale(1.1)" },
  },
}));
export const motionDivProps = {
  layout: true,
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 200 },
  transition: {
    default: { ease: "easeOut", duration: 0.5 },
    layout: { duration: 0.5 },
  },
};
export const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  minHeight: "200px",
  [theme.breakpoints.down("sm")]: {
    minHeight: "150px",
  },
}));
const getListStyles = () => ({
  maxHeight: "200px",
  overflowY: "auto",
});

export const commonMenuProps = {
  PaperProps: {
    sx: {
      "& .MuiList-root": getListStyles(),
    },
  },
};

export const StyledContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  padding: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));
export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: "100%",
  maxWidth: 600,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));
