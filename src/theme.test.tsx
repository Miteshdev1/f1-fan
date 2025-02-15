import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material/styles";
import { render } from "@testing-library/react";
import theme from "theme";

describe("MUI Theme Configuration", () => {
    it("should have the correct palette colors", () => {
        expect(theme.palette.mode).toBe("light");
        expect(theme.palette.primary.main).toBe("#3f51b5");
        expect(theme.palette.secondary.main).toBe("#f50057");
        expect(theme.palette.background.default).toBe("#f5f5f5");
    });

    it("should use the correct typography settings", () => {
        expect(theme.typography.fontFamily).toBe("Roboto, sans-serif");
    });

    it("should override MuiButton styles correctly", () => {
        const { getByText } = render(
            <ThemeProvider theme={theme}>
                <Button>Test Button</Button>
            </ThemeProvider>
        );
        const button = getByText("Test Button");
        expect(button).toHaveStyle("text-transform: none");
    });
});
