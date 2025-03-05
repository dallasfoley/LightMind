import { JournalPageForm } from "@/components/forms/journal-page-form";
import { getUser } from "@/server/actions/users/getUser";

export default async function JournalPage() {
  const user = await getUser();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Journal Entry</h1>
      {user ? <JournalPageForm user={user} /> : <p>User not found.</p>}
    </div>
  );
}
