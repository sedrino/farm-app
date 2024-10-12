import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { incomeCategoryKeys } from "@/query/options/income-categories";
import { $deleteIncomeCategory } from "@/server/functions/income-category";

export function useDeleteIncomeCategoryMutation(categoryId: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await $deleteIncomeCategory({ categoryId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: incomeCategoryKeys.all(),
      });
    },
  });
}
