"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function refreshDashboardData(timezoneOffset: number) {
  (await cookies()).set("userTimezoneOffset", timezoneOffset.toString(), {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: "/",
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard", "layout");
}
