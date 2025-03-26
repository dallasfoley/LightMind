import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const cardTexts = [
  {
    text: "Easily log your emotions, identify patterns and build healthier habits",
  },
  { text: "Designed with privacy and simplicity in mind" },
  { text: "Guided self-care tools including an AI chatbot" },
];

export default function HeroCards() {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-16 my-8">
      {cardTexts.map((text, key) => (
        <Card
          key={key}
          className="aspect-square h-64 text-slate-300 bg-gradient-to-tr from-blue-700 to-pink-700 size-48 flex flex-col justify-center items-center border-2 border-black"
        >
          <CardContent className="p-4">
            <CardHeader className="p-0">
              <CardTitle className="text-lg text-center">{text.text}</CardTitle>
            </CardHeader>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
