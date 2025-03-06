import { JournalPageForm } from "@/components/forms/journal-page-form";
import { getUser } from "@/server/actions/users/getUser";

export default async function JournalPage() {
  const user = await getUser();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-slate-300 dark:text-white">
              My Journal
            </h1>
            <p className="text-slate-500 dark:text-slate-400 italic">
              Capture your thoughts and memories
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-10">
              {user ? (
                <>
                  <div className="flex items-center mb-8">
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">
                        {new Date().toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <JournalPageForm user={user} />
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8 text-amber-600 dark:text-amber-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                  </div>
                  <p className="text-lg text-slate-800 dark:text-slate-200 font-medium mb-2">
                    User not found
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">
                    Please sign in to access your journal
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your journal entries are private and secure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
