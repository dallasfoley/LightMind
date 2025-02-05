import { DailyCheckInForm } from "@/components/forms/check-in-form";

export default function CheckInPage() {
  return (
    <main className="container flex flex-col items-center justify-center mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Daily Mental Health Check-in</h1>
      <DailyCheckInForm />
    </main>
  );
}
