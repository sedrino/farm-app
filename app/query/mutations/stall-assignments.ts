import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { stallKeys } from "@/query/options/stalls";
import { $assignHorse } from "@/server/functions/stall-assignment";

export function useAssignHorseMutation(stallId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $assignHorse>[0], "stallId">
    ) => {
      const result = await $assignHorse({ stallId, ...data });
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
