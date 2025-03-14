"use client";
import Image from "next/image";

export default function ChatbotIcon() {
  return (
    <div className="relative flex justify-center items-center glow-container overflow-visible">
      <Image
        src="/brain-logo.png"
        alt="logo"
        height={72}
        width={72}
        className="z-10 relative"
      />
    </div>
  );
}
