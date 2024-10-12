import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { staffKeys } from "@/query/options/staff";
import {
  $createStaff,
  $deleteStaff,
  $updateStaff,
} from "@/server/functions/staff";

export function useCreateStaffMutation() {
  return useMutation({
    mutationFn: async (data: Parameters<typeof $createStaff>[0]) => {
      const result = await $createStaff(data);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: staffKeys.all(),
      });
    },
  });
}

export function useDeleteStaffMutation(staffId: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await $deleteStaff({ staffId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: staffKeys.all(),
      });
    },
  });
}

export function useUpdateStaffMutation(staffId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $updateStaff>[0], "staffId">
    ) => {
      const result = await $updateStaff({ staffId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: staffKeys.byId({ staffId }),
      });
    },
  });
}
