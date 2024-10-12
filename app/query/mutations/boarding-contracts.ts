import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { contractKeys } from "@/query/options/contracts";
import { $terminateContract } from "@/server/functions/contract";

export function useTerminateContractMutation(contractId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $terminateContract>[0], "contractId">
    ) => {
      const result = await $terminateContract({ contractId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contractKeys.all(),
      });
    },
  });
}
