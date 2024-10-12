import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { budgetKeys } from "@/query/options/budgets";
import {
  $createBudget,
  $deleteBudget,
  $getExpenseCategories,
  $updateBudget,
} from "@/server/functions/budget";

export function useCreateBudgetMutation() {
  return useMutation({
    mutationFn: async (data: Parameters<typeof $createBudget>[0]) => {
      const result = await $createBudget(data);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: budgetKeys.all(),
      });
    },
  });
}

export function useDeleteBudgetMutation(budgetId: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await $deleteBudget({ budgetId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: budgetKeys.all(),
      });
    },
  });
}

export function useUpdateBudgetMutation(budgetId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $updateBudget>[0], "budgetId">
    ) => {
      const result = await $updateBudget({ budgetId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: budgetKeys.byId({ budgetId }),
      });
    },
  });
}

export function useExpenseCategoriesListOptions({
  budgetId,
}: {
  budgetId: string;
}) {
  return useQuery({
    queryKey: budgetKeys.all(),
    queryFn: async () => {
      const result = await $getExpenseCategories({ budgetId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
  });
}
