"use client";

import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Moon, Sun, Laptop, Palette } from "lucide-react";

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Choose Theme</h3>
      <RadioGroup
        defaultValue={theme}
        value={theme}
        onValueChange={setTheme}
        className="grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        <div>
          <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
          <Label
            htmlFor="dark"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-zinc-950 p-4 hover:bg-zinc-900 hover:text-accent peer-data-[state=checked]:border-white [&:has([data-state=checked])]:border-white cursor-pointer"
          >
            <Moon className="mb-3 h-6 w-6 text-white" />
            <span className="text-white">Dark</span>
          </Label>
        </div>

        <div>
          <RadioGroupItem value="light" id="light" className="peer sr-only" />
          <Label
            htmlFor="light"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-100 hover:text-accent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            <Sun className="mb-3 h-6 w-6 text-black" />
            <span className="text-black">Light</span>
          </Label>
        </div>

        <div>
          <RadioGroupItem value="system" id="system" className="peer sr-only" />
          <Label
            htmlFor="system"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-gradient-to-br from-white to-zinc-900 p-4 hover:bg-gradient-to-br hover:from-gray-100 hover:to-zinc-800 hover:text-accent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            <Laptop className="mb-3 h-6 w-6" />
            <span>System</span>
          </Label>
        </div>

        <div>
          <RadioGroupItem value="custom" id="custom" className="peer sr-only" />
          <Label
            htmlFor="custom"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 hover:opacity-90 hover:text-accent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            <Palette className="mb-3 h-6 w-6 text-white" />
            <span className="text-white">Custom</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
