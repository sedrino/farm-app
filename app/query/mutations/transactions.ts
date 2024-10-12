import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { transactionKeys } from "@/query/options/transactions";
import { $deleteTransaction } from "@/server/functions/transaction";

export function useDeleteTransactionMutation(transactionId: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await $deleteTransaction({ transactionId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: transactionKeys.all(),
      });
    },
  });
}
