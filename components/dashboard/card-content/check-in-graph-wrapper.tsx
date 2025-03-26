"use client";

import dynamic from "next/dynamic";
import { FadeLoader } from "react-spinners";
import { FlexibleCheckInType } from "./check-in-card";
const CheckInGraph = dynamic(() => import("./check-in-graph"), {
  ssr: false,
  loading: () => <FadeLoader />,
});

export default function CheckInGraphWrapper({
  data,
}: {
  data: FlexibleCheckInType[];
}) {
  return <CheckInGraph data={data} />;
}
