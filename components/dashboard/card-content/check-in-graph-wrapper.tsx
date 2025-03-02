"use client";

import { CheckInDataType } from "@/schema/checkInSchema";
import dynamic from "next/dynamic";
import { FadeLoader } from "react-spinners";
const CheckInGraph = dynamic(() => import("./check-in-graph"), {
  ssr: false,
  loading: () => <FadeLoader />,
});

export default function CheckInGraphWrapper({
  data,
}: {
  data: CheckInDataType[];
}) {
  return <CheckInGraph data={data} />;
}
