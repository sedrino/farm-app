import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { incomeKeys } from "@/query/options/incomes";
import {
  $createIncome,
  $deleteIncome,
  $updateIncome,
} from "@/server/functions/income";

export function useCreateIncomeMutation() {
  return useMutation({
    mutationFn: async (data: Parameters<typeof $createIncome>[0]) => {
      const result = await $createIncome(data);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: incomeKeys.all(),
      });
    },
  });
}

export function useDeleteIncomeMutation(incomeId: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await $deleteIncome({ incomeId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: incomeKeys.all(),
      });
    },
  });
}

export function useUpdateIncomeMutation(incomeId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $updateIncome>[0], "incomeId">
    ) => {
      const result = await $updateIncome({ incomeId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: incomeKeys.byId({ incomeId }),
      });
    },
  });
}
