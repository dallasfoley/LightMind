import { UserType } from "@/schema/userSchema";
import { getCheckIns } from "@/server/actions/getCheckIns";
import CheckInGraphWrapper from "./check-in-graph-wrapper";

export default async function CheckInCard({ user }: { user: UserType }) {
  if (!user) {
    return <p>User not found. Please log in.</p>;
  }

  const checkIns = await getCheckIns(user);

  return <>{checkIns.length > 0 && <CheckInGraphWrapper data={checkIns} />}</>;
}
