"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ThemeSelector from "@/components/settings/theme-selector";
import CustomColorPicker from "@/components/settings/custom-color-picker";

export default function AppearanceTab() {
  const { theme } = useTheme();

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-2xl">Theme Settings</CardTitle>
        <CardDescription>
          Customize the appearance of the application to your preference.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ThemeSelector />

        {theme === "custom" && <CustomColorPicker />}

        <div className="pt-6">
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
