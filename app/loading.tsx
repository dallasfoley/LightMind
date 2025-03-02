"use client";

import { FadeLoader } from "react-spinners";

export default function ProgressDemo() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-slate-900">
      <FadeLoader color="white" />
    </div>
  );
}
