import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { paymentKeys } from "@/query/options/payments";
import { $adjustPayment } from "@/server/functions/payment";

export function useAdjustPaymentMutation(paymentId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $adjustPayment>[0], "paymentId">
    ) => {
      const result = await $adjustPayment({ paymentId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: paymentKeys.all(),
      });
    },
  });
}
