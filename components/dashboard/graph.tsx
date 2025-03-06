"use client";

import { useState, useEffect } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { getCheckIns } from "@/server/actions/checkIns/getCheckIns";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { UserType } from "@/schema/userSchema";

type FieldType = "mood" | "energy" | "sleepQuality" | "sleepHours" | "stress";

// Define the type for our formatted chart data
type ChartData = {
  displayDate: string; // Formatted date string for display
  originalDate: string; // Original date string for debugging
  mood: number;
  energy: number;
  sleepQuality: number;
  sleepHours: number;
  stress: number;
  id: string;
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

// Helper function to format date for display
function formatDateForDisplay(dateStr: string): string {
  // Extract the date parts directly from the string
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [month, day] = match;
    // Convert month number to month name
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthIndex = Number.parseInt(month, 10) - 1;
    const monthName = monthNames[monthIndex];
    // Return formatted date
    return `${monthName} ${Number.parseInt(day, 10)}`;
  }
  // If we can't parse it, return the first 10 chars or the original string
  return dateStr.substring(0, 10) || dateStr;
}

// Custom tooltip component to ensure the date is displayed
const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartData;
    return (
      <div className="custom-tooltip text-black bg-white border border-gray-200 rounded-md p-2 shadow-sm text-sm">
        <p className="font-medium">Date: {data.displayDate}</p>
        <p>
          {fieldLabels[payload[0].dataKey as FieldType]}: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function FieldSelectorGraph({ user }: { user: UserType }) {
  const [selectedField, setSelectedField] = useState<FieldType>("mood");
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const checkInData = await getCheckIns(user);
        console.log("Raw check-in data:", checkInData);

        // Sort data by date
        const sortedData = [...checkInData].sort((a, b) => {
          // Safely convert to string if it's not already
          const dateA = typeof a.date === "string" ? a.date : String(a.date);
          const dateB = typeof b.date === "string" ? b.date : String(b.date);
          return dateA.localeCompare(dateB);
        });

        // Transform data for the chart
        const formattedData: ChartData[] = sortedData.map((item) => {
          // Get the date string
          const dateStr =
            typeof item.date === "string" ? item.date : String(item.date);

          // Format the display date without creating a Date object
          const displayDate = formatDateForDisplay(dateStr);

          return {
            displayDate,
            originalDate: dateStr, // Keep original for debugging
            id: item.id,
            mood: item.mood,
            energy: item.energy,
            sleepQuality: item.sleepQuality,
            sleepHours: item.sleepHours,
            stress: item.stress,
          };
        });

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching check-in data:", error);
      } finally {
        setLoading(false);
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
      return [0, 12];
    }
    return [0, 5];
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
        <CardContent className="p-4 h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p>Loading data...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p>No check-in data available. Start tracking your well-being!</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 15,
                  right: 20,
                  bottom: 15,
                  left: 45,
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
                      fontSize: "14px",
                      fill: "#666666",
                      fontWeight: 500,
                    },
                    offset: -35,
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
