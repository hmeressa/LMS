import { CssBaseline, StyledEngineProvider, createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import { useMemo, useState } from "react";
import { ColorModeContext } from "./ColorModeContext";
import GlobalStyles from "./globalStyles";

export default function CustomThemeProvider({ children }) {
  const [mode, setMode] = useState(localStorage.getItem("theme") || "dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
        localStorage.setItem("theme", mode === "light" ? "dark" : "light");
      },
    }),
    [mode]
  );

  const themeOptions = {
    palette: {
      mode: mode,
      primary: {
        main: "#00b7eb",
      },
      secondary: {
        main: "#28393e",
      },
      background:
        mode === "light"
          ? { paper: "#F0F0F0fa", default: "#F0F0F0" }
          : { paper: "#34383a", default: "#34383a" },
    },
  };

  const theme = useMemo(
    () =>
      createTheme({
        ...themeOptions,
      }),
    [mode]
  );

  return (
    <StyledEngineProvider injectFirst>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalStyles />
          {children}
        </ThemeProvider>
      </ColorModeContext.Provider>
    </StyledEngineProvider>
  );
}
