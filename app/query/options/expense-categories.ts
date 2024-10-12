import { queryOptions } from "@tanstack/react-query";

import { $listExpenseCategories } from "@/server/functions/expense-categories"; // Assuming this is the function to list expense categories

export const expenseCategoryKeys = {
  all: () => [{ scope: "expense-categories" }] as const,
};

export const expenseCategoriesListOptions = ({
  page = 1,
  pageSize = 10,
}: { page?: number; pageSize?: number } = {}) =>
  queryOptions({
    queryKey: expenseCategoryKeys.all(),
    queryFn: async () => {
      const response = await $listExpenseCategories({ page, pageSize });
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
