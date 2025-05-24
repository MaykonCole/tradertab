import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
});

export const useThemeMode = () => useContext(ThemeContext);

export const ThemeDefault = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Carrega do localStorage apenas no cliente
  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) {
      setDarkMode(JSON.parse(stored));
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("darkMode", JSON.stringify(next));
      return next;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      }),
    [darkMode],
  );

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeDefault;
