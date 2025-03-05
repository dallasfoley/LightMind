import { UserType } from "@/schema/userSchema";
import { getCheckIns } from "@/server/actions/checkIns/getCheckIns";
import CheckInGraphWrapper from "./check-in-graph-wrapper";

export default async function CheckInCard({ user }: { user: UserType }) {
  if (!user) {
    return <p>User not found. Please log in.</p>;
  }

  const checkIns = await getCheckIns(user, 7);

  return (
    <>
      {checkIns.length > 0 && (
        <div className="h-full w-full flex flex-col justify-center items-center">
          <CheckInGraphWrapper data={checkIns} />
          <h3 className="text-black">Weekly Mood</h3>
        </div>
      )}
    </>
  );
}
