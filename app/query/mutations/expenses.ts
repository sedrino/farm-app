import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { expenseKeys } from "@/query/options/expenses";
import {
  $createExpense,
  $deleteExpense,
  $updateExpense,
} from "@/server/functions/expense";

export function useCreateExpenseMutation() {
  return useMutation({
    mutationFn: async (data: Parameters<typeof $createExpense>[0]) => {
      const result = await $createExpense(data);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: expenseKeys.all(),
      });
    },
  });
}

export function useDeleteExpenseMutation(expenseId: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await $deleteExpense({ expenseId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: expenseKeys.all(),
      });
    },
  });
}

export function useUpdateExpenseMutation(expenseId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $updateExpense>[0], "expenseId">
    ) => {
      const result = await $updateExpense({ expenseId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: expenseKeys.byId({ expenseId }),
      });
    },
  });
}
