"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  // Ensure we only render theme-dependent components after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

// Custom theme context for additional theme features
type CustomThemeContextType = {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  secondaryColor: string;
  setSecondaryColor: (color: string) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
};

const CustomThemeContext = createContext<CustomThemeContextType | undefined>(
  undefined
);

export function CustomThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [primaryColor, setPrimaryColor] = useState("#6366f1"); // Default indigo
  const [secondaryColor, setSecondaryColor] = useState("#4f46e5"); // Default indigo
  const [accentColor, setAccentColor] = useState("#818cf8"); // Default indigo

  // Apply custom colors to CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty("--primary", primaryColor);
    document.documentElement.style.setProperty("--secondary", secondaryColor);
    document.documentElement.style.setProperty("--accent", accentColor);
  }, [primaryColor, secondaryColor, accentColor]);

  return (
    <CustomThemeContext.Provider
      value={{
        primaryColor,
        setPrimaryColor,
        secondaryColor,
        setSecondaryColor,
        accentColor,
        setAccentColor,
      }}
    >
      {children}
    </CustomThemeContext.Provider>
  );
}

export const useCustomTheme = () => {
  const context = useContext(CustomThemeContext);
  if (context === undefined) {
    throw new Error("useCustomTheme must be used within a CustomThemeProvider");
  }
  return context;
};
