
import * as React from "react";

// We now only have a light theme
interface ThemeContextProps {
  theme: "light";
}

export const ThemeContext = React.createContext<ThemeContextProps>({
  theme: "light",
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  // Apply light theme to document
  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("dark");
    root.classList.add("light");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: "light" }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => React.useContext(ThemeContext);
