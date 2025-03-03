"use client";

import { useState, useEffect, Suspense } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { getCheckIns } from "@/server/actions/getCheckIns";
import { format } from "date-fns";
import { UserType } from "@/schema/userSchema";
import { FadeLoader } from "react-spinners";

type FieldType = "mood" | "energy" | "sleepQuality" | "sleepHours" | "stress";

// Define the type for our formatted chart data
type ChartData = {
  displayDate: string; // Formatted date string for display
  rawDate: Date; // Original date for sorting
  mood: number;
  energy: number;
  sleepQuality: number;
  sleepHours: number;
  stress: number;
  id: string; // Keep the ID for potential future use
};

const fieldLabels: Record<FieldType, string> = {
  mood: "Mood",
  energy: "Energy",
  sleepQuality: "Sleep Quality",
  sleepHours: "Hours of Sleep",
  stress: "Stress",
};

const fieldColors: Record<FieldType, string> = {
  mood: "#4ade80",
  energy: "#f97316",
  sleepQuality: "#8b5cf6",
  sleepHours: "#3b82f6",
  stress: "#ef4444",
};

export default function FieldSelectorGraph({ user }: { user: UserType }) {
  const [selectedField, setSelectedField] = useState<FieldType>("mood");
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const checkInData = await getCheckIns(user);

        const sortedData = [...checkInData].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        const formattedData: ChartData[] = sortedData.map((item) => ({
          displayDate: format(new Date(item.date), "MMM d"),
          rawDate: new Date(item.date),
          id: item.id,
          mood: item.mood,
          energy: item.energy,
          sleepQuality: item.sleepQuality,
          sleepHours: item.sleepHours,
          stress: item.stress,
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching check-in data:", error);
      }
    }

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleFieldChange = (value: string) => {
    setSelectedField(value as FieldType);
  };

  // Get min and max values for Y axis
  const getYDomain = () => {
    if (selectedField === "sleepHours") {
      return [0, 24];
    }
    return [0, 6];
  };

  return (
    <div className="space-y-4">
      <Tabs
        defaultValue="mood"
        value={selectedField}
        onValueChange={handleFieldChange}
        className="w-full"
      >
        <TabsList className="grid grid-cols-5 w-full">
          {Object.entries(fieldLabels).map(([field, label]) => (
            <TabsTrigger key={field} value={field}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card className="p-2">
        <CardContent className="pt-4 pr-6 h-[300px]">
          {data.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p>No check-in data available. Start tracking your well-being!</p>
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="flex justify-center items-center h-full w-full">
                  <FadeLoader />
                </div>
              }
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="displayDate"
                    tick={{ fontSize: 12 }}
                    height={40}
                  />
                  <YAxis
                    domain={getYDomain()}
                    tick={{ fontSize: 12 }}
                    width={45}
                    label={{
                      value: fieldLabels[selectedField],
                      angle: -90,
                      position: "insideLeft",
                      style: {
                        textAnchor: "middle",
                        fontSize: "18px",
                        fill: "#666666",
                      },
                      offset: 0,
                    }}
                  />
                  <Tooltip
                    formatter={(value) => [
                      `${value}`,
                      fieldLabels[selectedField],
                    ]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey={selectedField}
                    stroke={fieldColors[selectedField]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name={fieldLabels[selectedField]}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Suspense>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
