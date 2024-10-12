import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { categoryKeys } from "@/query/options/categories";
import { $deleteCategory } from "@/server/functions/category";

export function useDeleteCategoryMutation(categoryId: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await $deleteCategory({ categoryId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.all(),
      });
    },
  });
}
