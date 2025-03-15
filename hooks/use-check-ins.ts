"use client";

import useSWR from "swr";
import type { CheckInDataType } from "@/schema/checkInSchema";

export function useCheckIns(
  userId: string,
  initialData: CheckInDataType[] = []
) {
  const url = `/api/check-ins?userId=${userId}`;

  const { data, error, isLoading, mutate } = useSWR<{
    checkIns: CheckInDataType[];
  }>(userId ? url : null, {
    fallbackData:
      initialData.length > 0 ? { checkIns: initialData } : undefined,
    revalidateOnMount: initialData.length === 0,
  });

  return {
    checkIns: data?.checkIns || [],
    isLoading: isLoading && initialData.length === 0,
    isError: error,
    mutate,
  };
}
