"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useCustomTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Moon, Sun, Laptop, Palette } from "lucide-react";

export default function SettingsForm() {
  const { theme, setTheme } = useTheme();
  const {
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,
    accentColor,
    setAccentColor,
  } = useCustomTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("appearance");

  // Ensure we only render theme-dependent components after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <Tabs
        defaultValue="appearance"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-zinc-500 text-white">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance">
          <Card className="p-4">
            <CardHeader>
              <CardTitle className="text-2xl">Theme Settings</CardTitle>
              <CardDescription>
                Customize the appearance of the application to your preference.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Choose Theme</h3>
                <RadioGroup
                  defaultValue={theme}
                  value={theme}
                  onValueChange={setTheme}
                  className="grid grid-cols-2 gap-4 md:grid-cols-4"
                >
                  <div>
                    <RadioGroupItem
                      value="dark"
                      id="dark"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="dark"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-zinc-950 p-4 hover:bg-zinc-900 hover:text-accent peer-data-[state=checked]:border-white [&:has([data-state=checked])]:border-white cursor-pointer"
                    >
                      <Moon className="mb-3 h-6 w-6 text-white" />
                      <span className="text-white">Dark</span>
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem
                      value="light"
                      id="light"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="light"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-100 hover:text-accent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <Sun className="mb-3 h-6 w-6 text-black" />
                      <span className="text-black">Light</span>
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem
                      value="system"
                      id="system"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="system"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-gradient-to-br from-white to-zinc-900 p-4 hover:bg-gradient-to-br hover:from-gray-100 hover:to-zinc-800 hover:text-accent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <Laptop className="mb-3 h-6 w-6" />
                      <span>System</span>
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem
                      value="custom"
                      id="custom"
                      className="peer sr-only"
                    />
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

              {theme === "custom" && (
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
              )}

              <div className="pt-6">
                <Button className="w-full md:w-auto text-zinc-900 hover:bg-zinc-300">
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card className="p-4">
            <CardHeader>
              <CardTitle className="text-2xl">Account Settings</CardTitle>
              <CardDescription>
                Manage your account details and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Account settings will be implemented in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
