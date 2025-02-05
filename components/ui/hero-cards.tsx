import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GlareCard } from "./glare-card";

export default function HeroCards() {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-16 mt-6 text-lg md:text-xl text-blue-950">
      <GlareCard
        width="240px"
        height="240px"
        className="flex items-center justify-center p-4 text-center "
      >
        Easily log your emotions, identify patterns and build healthier habits
      </GlareCard>

      <Card className="aspect-square size-48 flex flex-col justify-center items-center p-4 md:text-xl border-2 border-black">
        <CardContent>
          <CardHeader>
            <CardTitle className="text-center">
              Designed with privacy and simplicity in mind
            </CardTitle>
          </CardHeader>
        </CardContent>
      </Card>
      <Card className="aspect-square size-48 flex flex-col justify-center items-center p-4 md:text-xl border-2 border-black">
        <CardContent>
          <CardHeader>
            <CardTitle className="text-center">
              Guided self-care tools including an AI chatbot
            </CardTitle>
          </CardHeader>
        </CardContent>
      </Card>
    </div>
  );
}
