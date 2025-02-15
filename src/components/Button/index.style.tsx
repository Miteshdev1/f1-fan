import { styled } from "@mui/material/styles";

export const StyledButtonContainer = styled("div")(
  ({ step }: { step: number }) => ({
    display: "flex",
    justifyContent: step > 1 ? "space-between" : "flex-end",
    width: "100%",
    marginTop: "20px",
  })
);
