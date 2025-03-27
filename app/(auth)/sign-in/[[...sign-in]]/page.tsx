import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center">
      <SignIn />
      <div className="text-zinc-300 text-center mt-4">
        Please check your email, including spam/junk folders, for email
        verification.
      </div>
    </div>
  );
}
