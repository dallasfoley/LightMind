import { DailyCheckInForm } from "@/components/forms/check-in-form";
import { getUser } from "@/server/actions/getUser";

export default async function CheckInPage() {
  const user = await getUser();
  return (
    <main className="container flex flex-col items-center justify-center mx-auto py-10">
      <h1 className="text-3xl md:text-5xl font-bold mb-6">Daily Check-In</h1>
      {user ? <DailyCheckInForm userId={user.id} /> : <p>User not found.</p>}
    </main>
  );
}
