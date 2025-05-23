import { DailyCheckInForm } from "@/components/forms/check-in-form";
import { getUser } from "@/server/actions/users/getUser";

export default async function CheckInPage() {
  const user = await getUser();
  return (
    <main className="container flex flex-col items-center justify-center mx-auto py-10">
      <h1 className="text-3xl md:text-5xl text-zinc-900 dark:text-zinc-200 font-bold mb-6">
        Daily Check-In
      </h1>
      {user ? (
        <DailyCheckInForm userId={user.id} update={false} />
      ) : (
        <p>User not found.</p>
      )}
    </main>
  );
}
