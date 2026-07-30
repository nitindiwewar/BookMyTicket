/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useMemo } from "react";

export const ThemeContext = createContext({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  useEffect(() => {
    document.documentElement.dataset.theme = "light";
  }, []);

  const value = useMemo(
    () => ({
      theme: "light",
      setTheme: () => {},
      toggleTheme: () => {},
    }),
    []
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
