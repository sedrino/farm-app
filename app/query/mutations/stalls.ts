import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { stallKeys } from "@/query/options/stalls";
import {
  $createStall,
  $deleteStall,
  $updateStall,
} from "@/server/functions/stall";

export function useCreateStallMutation() {
  return useMutation({
    mutationFn: async (data: Parameters<typeof $createStall>[0]) => {
      const result = await $createStall(data);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: stallKeys.all(),
      });
    },
  });
}

export function useDeleteStallMutation(stallId: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await $deleteStall({ stallId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: stallKeys.all(),
      });
    },
  });
}

export function useUpdateStallMutation(stallId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $updateStall>[0], "stallId">
    ) => {
      const result = await $updateStall({ stallId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: stallKeys.byId({ stallId }),
      });
    },
  });
}
