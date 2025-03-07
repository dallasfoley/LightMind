"use client";

import { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import type { CheckInDataType } from "@/schema/checkInSchema";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { format } from "date-fns";

// Define the type for our formatted chart data
type ChartData = {
  displayDate: string;
  mood: number;
  energy: number;
  sleepQuality: number;
  sleepHours: number;
  stress: number;
  id: string;
  originalDate: Date;
};

// Custom tooltip component
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white text-black border border-gray-200 rounded-md p-2 shadow-sm text-sm">
        <p className="font-medium">Date: {label}</p>
        <p>Mood: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function CheckInGraph({ data }: { data: CheckInDataType[] }) {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    // Transform data for the chart
    const formattedData: ChartData[] = data.map((item) => {
      // Ensure date is a Date object
      const dateObj =
        item.date instanceof Date ? item.date : new Date(item.date);

      // Format the date for display
      const displayDate = format(dateObj, "MMM d");

      return {
        displayDate,
        originalDate: dateObj,
        id: item.id,
        mood: item.mood,
        energy: item.energy,
        sleepQuality: item.sleepQuality,
        sleepHours: item.sleepHours,
        stress: item.stress,
      };
    });

    console.log(
      "Check-in graph data:",
      formattedData.map((d) => ({
        displayDate: d.displayDate,
        originalDate: d.originalDate.toISOString().split("T")[0],
        mood: d.mood,
      }))
    );

    setChartData(formattedData);
  }, [data]);

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 5,
            bottom: 5,
            left: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="displayDate" tick={{ fontSize: 10 }} height={20} />
          <YAxis domain={[0, 5]} tick={{ fontSize: 10 }} width={20} />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            type="monotone"
            dataKey="mood"
            fill="#8884d8"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
