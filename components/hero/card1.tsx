import { Card, CardContent } from "@/components/ui/card";
import { LampContainer } from "../ui/lamp";

export default function Card1() {
  return (
    <Card className="aspect-square size-48 flex flex-col justify-center items-center p-4 border-2 border-black overflow-hidden">
      <CardContent className="p-0 w-full h-full">
        <LampContainer className="w-full h-full">
          <p className="text-center text-sm md:text-base lg:text-lg text-white z-50">
            Easily log your emotions, identify patterns and build healthier
            habits
          </p>
        </LampContainer>
      </CardContent>
    </Card>
  );
}
