import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { scheduleKeys } from "@/query/options/schedules";
import {
  $createSchedule,
  $editSchedule,
  $updateSchedule,
} from "@/server/functions/schedule";

export function useCreateScheduleMutation() {
  return useMutation({
    mutationFn: async (data: Parameters<typeof $createSchedule>[0]) => {
      const result = await $createSchedule(data);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: scheduleKeys.all(),
      });
    },
  });
}

export function useEditScheduleMutation(scheduleId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $editSchedule>[0], "scheduleId">
    ) => {
      const result = await $editSchedule({ scheduleId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: scheduleKeys.byId({ scheduleId }),
      });
    },
  });
}

export function useUpdateScheduleMutation(scheduleId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $updateSchedule>[0], "scheduleId">
    ) => {
      const result = await $updateSchedule({ scheduleId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: scheduleKeys.byId({ scheduleId }),
      });
    },
  });
}
