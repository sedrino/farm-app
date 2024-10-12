import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { pastureKeys } from "@/query/options/pastures";
import {
  $createPasture,
  $deletePasture,
  $startPastureRotation,
  $updatePasture,
} from "@/server/functions/pasture";

export function useCreatePastureMutation() {
  return useMutation({
    mutationFn: async (data: Parameters<typeof $createPasture>[0]) => {
      const result = await $createPasture(data);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: pastureKeys.all(),
      });
    },
  });
}

export function useDeletePastureMutation(pastureId: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await $deletePasture({ pastureId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: pastureKeys.all(),
      });
    },
  });
}

export function useStartPastureRotationMutation(pastureId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $startPastureRotation>[0], "pastureId">
    ) => {
      const result = await $startPastureRotation({ pastureId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: pastureKeys.byId({ pastureId }),
      });
    },
  });
}

export function useUpdatePastureMutation(pastureId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $updatePasture>[0], "pastureId">
    ) => {
      const result = await $updatePasture({ pastureId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: pastureKeys.byId({ pastureId }),
      });
    },
  });
}
