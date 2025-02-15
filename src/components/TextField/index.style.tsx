import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledTextField = styled(TextField)(() => ({
  "& .MuiFormHelperText-root": {
    marginLeft: 0,
  },
}));
