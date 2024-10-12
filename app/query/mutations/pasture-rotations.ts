import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { pastureRotationKeys } from "@/query/options/pastures";
import {
  $createPastureRotation,
  $startNewRotation,
} from "@/server/functions/pasture-rotation";

export function useCreatePastureRotationMutation() {
  return useMutation({
    mutationFn: async (data: Parameters<typeof $createPastureRotation>[0]) => {
      const result = await $createPastureRotation(data);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: pastureRotationKeys.all(),
      });
    },
  });
}

export function useStartNewRotationMutation() {
  return useMutation({
    mutationFn: async (data: Parameters<typeof $startNewRotation>[0]) => {
      const result = await $startNewRotation(data);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: pastureRotationKeys.all(),
      });
    },
  });
}
