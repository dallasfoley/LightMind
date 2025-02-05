"use server";

import { checkInSchema, type CheckInFormData } from "@/schema/checkInSchema";

export async function submitCheckIn(data: CheckInFormData) {
  const result = checkInSchema.safeParse(data);

  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  // TODO: Save the data to your database
  console.log("Check-in data:", result.data);

  return { success: true };
}
