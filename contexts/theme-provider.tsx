"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
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
  customTheme: string;
  setCustomTheme: (color: string) => void;
  useCustomBackground: boolean;
  setUseCustomBackground: (use: boolean) => void;
};

const CustomThemeContext = createContext<CustomThemeContextType | undefined>(
  undefined
);

export function CustomThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [customTheme, setCustomTheme] = useState("#6366f1"); // Default indigo
  const [useCustomBackground, setUseCustomBackground] = useState(false);
  const { theme } = useTheme();

  // Apply custom colors to CSS variables
  useEffect(() => {
    // Always set the primary color
    document.documentElement.style.setProperty("--primary", customTheme);

    // Only set background if useCustomBackground is true
    if (useCustomBackground) {
      // Set the background color directly on the custom-bg elements for immediate effect
      const customBgElements = document.querySelectorAll(".custom-bg");
      customBgElements.forEach((el) => {
        (el as HTMLElement).style.backgroundColor = customTheme;
      });

      // Also set the CSS variable for styled components
      document.documentElement.style.setProperty(
        "--background-custom",
        customTheme
      );
    } else {
      // Reset to default when custom background is disabled
      const customBgElements = document.querySelectorAll(".custom-bg");
      customBgElements.forEach((el) => {
        (el as HTMLElement).style.backgroundColor = "";
      });
      document.documentElement.style.removeProperty("--background-custom");
    }
  }, [customTheme, useCustomBackground, theme]);

  return (
    <CustomThemeContext.Provider
      value={{
        customTheme,
        setCustomTheme,
        useCustomBackground,
        setUseCustomBackground,
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
