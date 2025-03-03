"use client";

import { Button } from "@/components/ui/button";
import { FlipWords } from "@/components/ui/flip-words";
import HeroCards from "@/components/ui/hero-cards";
import { LampContainer } from "@/components/ui/lamp";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HeroPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <LampContainer>
      <h3 className="flex items-center text-xl md:text-4xl -translate-y-10">
        <Image
          src={"/brain-logo.png"}
          alt=""
          height={64}
          width={64}
          className="mr-4"
        />
        Welcome to LightMind
      </h3>

      <h1 className="text-3xl md:text-6xl pt-0 mt-0 text-center">
        <FlipWords
          words={["Track", "Visualize", "Enrich", "Illuminate"]}
          duration={1500}
          className="text-white"
        />
        Your Mental Health
      </h1>

      <HeroCards />
      <div className="flex flex-col md:flex-row gap-4 items-center my-4 md:my-8">
        <Button
          onClick={() => router.push("/sign-up")}
          className="md:h-10 bg-white text-black z-10 hover:text-white"
        >
          <h2 className="md:text-lg flex items-center justify-between">
            Create an account to get started!
            <ArrowRight className="ml-2" />
          </h2>
        </Button>
      </div>
      <div className="flex justify-center items-center w-full">
        <Separator className="w-16 md:w-32" />
        <span className="mx-4">or</span>
        <Separator className="w-16 md:w-32" />
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-center my-4 md:my-8">
        <Button
          onClick={() => router.push("/sign-in")}
          className="md:h-10 bg-white text-black z-10 hover:text-white hover:scale-110 transition duration-300"
        >
          <h2 className="md:text-lg flex items-center justify-between">
            Sign-in
            <ArrowRight className="ml-2" />
          </h2>
        </Button>
      </div>
    </LampContainer>
  );
}
