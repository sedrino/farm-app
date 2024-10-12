import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { shiftKeys } from "@/query/options/shifts";
import {
  $assignShift,
  $createShift,
  $deleteShift,
  $updateShift,
} from "@/server/functions/shift";

export function useAssignShiftMutation(staffId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $assignShift>[0], "staffId">
    ) => {
      const result = await $assignShift({ staffId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: shiftKeys.all(),
      });
    },
  });
}

export function useCreateShiftMutation() {
  return useMutation({
    mutationFn: async (data: Parameters<typeof $createShift>[0]) => {
      const result = await $createShift(data);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: shiftKeys.all(),
      });
    },
  });
}

export function useDeleteShiftMutation(shiftId: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await $deleteShift({ shiftId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: shiftKeys.all(),
      });
    },
  });
}

export function useUpdateShiftMutation(shiftId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $updateShift>[0], "shiftId">
    ) => {
      const result = await $updateShift({ shiftId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: shiftKeys.byId({ shiftId }),
      });
    },
  });
}
