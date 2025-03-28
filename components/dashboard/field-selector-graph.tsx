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
import { useCheckIns } from "@/hooks/use-check-ins";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { Skeleton } from "@/components/ui/skeleton";
import type { CheckInDataType } from "@/schema/checkInSchema";
import { useMediaQuery } from "@/hooks/use-media-query";

type FieldType = "mood" | "energy" | "sleepQuality" | "sleepHours" | "stress";

// Define the type for our formatted chart data
type ChartData = {
  displayDate: string; // Formatted date string for display
  originalDate: string; // Original date string for debugging
  sortDate: string; // Date string for sorting
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
function formatDateForDisplay(dateObj: Date): string {
  // Get month and day
  const month = dateObj.getMonth(); // 0-11
  const day = dateObj.getDate(); // 1-31

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
  const monthName = monthNames[month];

  // Return formatted date
  return `${monthName} ${day}`;
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

// Update the component to accept initial data
export default function FieldSelectorGraph({
  userId,
  initialData = [],
}: {
  userId: string;
  initialData?: CheckInDataType[];
}) {
  const [selectedField, setSelectedField] = useState<FieldType>("mood");
  const [data, setData] = useState<ChartData[]>([]);

  const { checkIns, isLoading, isError } = useCheckIns(userId, initialData);
  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    if (checkIns.length > 0) {
      // Transform data for the chart
      const formattedData: ChartData[] = checkIns.map(
        (item: CheckInDataType) => {
          // Ensure date is a Date object
          const dateObj =
            item.date instanceof Date ? item.date : new Date(item.date);

          // Format the date for display
          const displayDate = formatDateForDisplay(dateObj);

          // Create a sortable date string (YYYY-MM-DD)
          const sortDate = dateObj.toISOString().split("T")[0];

          // Create the original date string for debugging
          const originalDate = dateObj.toISOString();

          return {
            displayDate,
            originalDate,
            sortDate,
            id: item.id,
            mood: item.mood,
            energy: item.energy,
            sleepQuality: item.sleepQuality,
            sleepHours: item.sleepHours,
            stress: item.stress,
          };
        }
      );

      // Sort data by date
      const sortedData = [...formattedData].sort((a, b) => {
        return a.sortDate.localeCompare(b.sortDate);
      });

      setData(sortedData);
    }
  }, [checkIns]);

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

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p>Error loading data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs
        defaultValue="mood"
        value={selectedField}
        onValueChange={handleFieldChange}
        className="w-full"
      >
        <div className="rounded-md border">
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 w-full">
            {Object.entries(fieldLabels).map(([field, label]) => (
              <TabsTrigger
                key={field}
                value={field}
                className="px-2 py-1.5 text-xs md:text-sm"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

      <Card className="p-2 dark:bg-zinc-900">
        <CardContent className="p-4 h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Skeleton className="h-[250px] w-full" />
            </div>
          ) : data.length === 0 ? (
            <div className="flex items-center justify-center h-full text-zinc-300">
              <p>No check-in data available. Start tracking your well-being!</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 15,
                  right: isMobile ? 10 : 20,
                  bottom: 15,
                  left: isMobile ? 25 : 45,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="displayDate"
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  height={isMobile ? 30 : 40}
                  tickFormatter={
                    isMobile ? (value) => value.split(" ")[0] : undefined
                  }
                />
                <YAxis
                  domain={getYDomain()}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  width={isMobile ? 30 : 45}
                  label={{
                    value: fieldLabels[selectedField],
                    angle: -90,
                    position: "insideLeft",
                    style: {
                      textAnchor: "middle",
                      fontSize: isMobile ? "12px" : "14px",
                      fill: "#666666",
                      fontWeight: 500,
                    },
                    offset: isMobile ? -20 : -35,
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
