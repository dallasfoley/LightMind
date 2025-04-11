"use client";

import { useCustomTheme } from "@/contexts/theme-provider";
import { HexColorPicker } from "react-colorful";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function CustomColorPicker() {
  const {
    customTheme,
    setCustomTheme,
    useCustomBackground,
    setUseCustomBackground,
  } = useCustomTheme();

  return (
    <div className="flex flex-col items-center space-y-4 pt-4 border-t">
      <h3 className="text-lg font-medium mb-4">Custom Theme</h3>
      <HexColorPicker color={customTheme} onChange={setCustomTheme} />

      <div className="flex items-center space-x-2 mt-4">
        <Switch
          id="use-as-background"
          checked={useCustomBackground}
          onCheckedChange={setUseCustomBackground}
        />
        <Label htmlFor="use-as-background">Use as background color</Label>
      </div>
    </div>
  );
}
