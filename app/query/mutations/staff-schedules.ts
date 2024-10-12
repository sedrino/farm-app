import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { staffScheduleKeys } from "@/query/options/staff-schedules";
import { $createStaffSchedule } from "@/server/functions/staff-schedule";

export function useStaffScheduleMutation(staffId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $createStaffSchedule>[0], "staffId">
    ) => {
      const result = await $createStaffSchedule({ staffId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: staffScheduleKeys.byStaffId({ staffId }),
      });
    },
  });
}
