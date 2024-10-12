import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { feedingScheduleKeys } from "@/query/options/feeding-schedules";
import {
  $createFeedingSchedule,
  $deleteFeedingSchedule,
} from "@/server/functions/feeding-schedule";

export function useCreateFeedingScheduleMutation(horseId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $createFeedingSchedule>[0], "horseId">
    ) => {
      const result = await $createFeedingSchedule({ horseId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: feedingScheduleKeys.list({ horseId }),
      });
    },
  });
}

export function useDeleteFeedingScheduleMutation(scheduleId: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await $deleteFeedingSchedule({ scheduleId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: feedingScheduleKeys.all(),
      });
    },
  });
}
