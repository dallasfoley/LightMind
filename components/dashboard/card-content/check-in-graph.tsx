"use client";

import { CheckInDataType } from "@/schema/checkInSchema";
import { BarChart } from "recharts";
import { Bar } from "recharts";

export default function CheckInGraph({ data }: { data: CheckInDataType[] }) {
  console.log("Check-in data:", data);

  if (!data || data.length === 0) {
    return <p>No check-in data available.</p>;
  }

  return (
    <BarChart width={100} height={100} data={data}>
      <Bar dataKey="mood" fill="#8884d8" />
    </BarChart>
  );
}
