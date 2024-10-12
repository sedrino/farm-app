import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { billingConfigurationKeys } from "@/query/options/billing-configurations";
import { $updateBillingConfiguration } from "@/server/functions/billing-configuration";

export function useUpdateBillingConfigurationMutation() {
  return useMutation({
    mutationFn: async (
      data: Parameters<typeof $updateBillingConfiguration>[0]
    ) => {
      const result = await $updateBillingConfiguration(data);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: billingConfigurationKeys.all(),
      });
    },
  });
}
