import CheckInGraph from "./check-in-graph";
import { UserType } from "@/schema/userSchema";
import { getCheckIns } from "@/server/actions/getCheckIns";

export default async function CheckInCard({ user }: { user: UserType }) {
  if (!user) {
    return <p>User not found. Please log in.</p>;
  }

  const checkIns = await getCheckIns(user);

  return <>{checkIns.length > 0 && <CheckInGraph data={checkIns} />}</>;
}
