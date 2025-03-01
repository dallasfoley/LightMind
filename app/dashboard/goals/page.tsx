import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function GoalsPage() {
  return (
    <main>
      <Card className="flex flex-col items-center text-black p-4">
        <CardHeader>
          <CardTitle className="text-3xl md:text-5xl">
            Create a goal to get started
          </CardTitle>
          <CardDescription>
            Goals can be as small as drinking enough water to as big curing
            cancer!
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
        <Button className="my-8">Add Goal</Button>
      </Card>
    </main>
  );
}
