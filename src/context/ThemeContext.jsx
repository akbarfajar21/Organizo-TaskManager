import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  // State untuk menyimpan theme
  const [isDark, setIsDark] = useState(() => {
    // Cek localStorage saat pertama kali load
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });

  // Effect untuk apply theme ke HTML element
  useEffect(() => {
    const html = document.documentElement;

    if (isDark) {
      html.classList.add("dark");
      html.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.add("light");
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Function untuk toggle theme
  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const value = {
    isDark,
    toggleTheme,
    theme: isDark ? "dark" : "light",
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
