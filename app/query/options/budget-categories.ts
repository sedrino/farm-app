import { queryOptions } from "@tanstack/react-query";

import { $listBudgetCategories } from "@/server/functions/budget-categories"; // Assuming this is the function to list budget categories

export const budgetCategoryKeys = {
  all: () => [{ scope: "budget-categories" }] as const,
};

export const budgetCategoriesListOptions = ({
  page = 1,
  pageSize = 10,
}: { page?: number; pageSize?: number } = {}) =>
  queryOptions({
    queryKey: budgetCategoryKeys.all(),
    queryFn: async () => {
      const response = await $listBudgetCategories({ page, pageSize });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        return [];
      }
      return response.data;
    },
  });
