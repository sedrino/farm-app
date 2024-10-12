import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { healthRecordKeys } from "@/query/options/health-records";
import { $createHealthRecord } from "@/server/functions/health-record";

export function useCreateHealthRecordMutation(horseId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $createHealthRecord>[0], "horseId">
    ) => {
      const result = await $createHealthRecord({ horseId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: healthRecordKeys.list({ horseId }),
      });
    },
  });
}
