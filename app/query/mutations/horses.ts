import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { horseKeys } from "@/query/options/horses";
import {
  $createHorse,
  $deleteHorse,
  $updateHorse,
} from "@/server/functions/horse";

export function useCreateHorseMutation() {
  return useMutation({
    mutationFn: async (data: Parameters<typeof $createHorse>[0]) => {
      const result = await $createHorse(data);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: horseKeys.all(),
      });
    },
  });
}

export function useDeleteHorseMutation(horseId: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await $deleteHorse({ horseId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: horseKeys.all(),
      });
    },
  });
}

export function useUpdateHorseMutation(horseId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $updateHorse>[0], "horseId">
    ) => {
      const result = await $updateHorse({ horseId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: horseKeys.byId({ horseId }),
      });
    },
  });
}
