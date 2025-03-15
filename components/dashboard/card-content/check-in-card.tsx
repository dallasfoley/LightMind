import { UserType } from "@/schema/userSchema";
import CheckInGraphWrapper from "./check-in-graph-wrapper";

export type FlexibleCheckInType = {
  date: Date | string;
  id: string;
  mood: number;
  energy: number;
  sleepHours: number;
  sleepQuality: number;
  stress: number;
  notes?: string | null;
  userId: string;
};

export default async function CheckInCard({
  user,
  checkIns,
}: {
  user: UserType;
  checkIns: FlexibleCheckInType[];
}) {
  if (!user) {
    return <p>User not found. Please log in.</p>;
  }

  return (
    <>
      {checkIns.length > 0 && (
        <div className="h-full w-full flex flex-col justify-center items-center">
          <CheckInGraphWrapper data={checkIns} />
          <h3 className="text-zinc-900 dark:text-zinc-200">Weekly Mood</h3>
        </div>
      )}
    </>
  );
}
