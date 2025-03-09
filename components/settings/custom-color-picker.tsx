"use client";

import { useCustomTheme } from "@/components/theme-provider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function CustomColorPicker() {
  const {
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,
    accentColor,
    setAccentColor,
  } = useCustomTheme();

  return (
    <div className="space-y-4 pt-4 border-t">
      <h3 className="text-lg font-medium mb-4">Custom Colors</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="primary-color">Primary Color</Label>
          <div className="flex space-x-2">
            <div
              className="w-10 h-10 rounded-md border"
              style={{ backgroundColor: primaryColor }}
            />
            <Input
              id="primary-color"
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondary-color">Secondary Color</Label>
          <div className="flex space-x-2">
            <div
              className="w-10 h-10 rounded-md border"
              style={{ backgroundColor: secondaryColor }}
            />
            <Input
              id="secondary-color"
              type="color"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="accent-color">Accent Color</Label>
          <div className="flex space-x-2">
            <div
              className="w-10 h-10 rounded-md border"
              style={{ backgroundColor: accentColor }}
            />
            <Input
              id="accent-color"
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <h4 className="text-md font-medium mb-2">Preview</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className="p-4 rounded-md text-white flex items-center justify-center"
            style={{ backgroundColor: primaryColor }}
          >
            Primary
          </div>
          <div
            className="p-4 rounded-md text-white flex items-center justify-center"
            style={{ backgroundColor: secondaryColor }}
          >
            Secondary
          </div>
          <div
            className="p-4 rounded-md text-white flex items-center justify-center"
            style={{ backgroundColor: accentColor }}
          >
            Accent
          </div>
        </div>
      </div>
    </div>
  );
}
