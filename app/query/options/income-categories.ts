import { queryOptions } from "@tanstack/react-query";

import { $listIncomeCategories } from "@/server/functions/income-categories"; // Assuming this is the function to list income categories

export const incomeCategoryKeys = {
  all: () => [{ scope: "income-categories" }] as const,
};

export const incomeCategoriesListOptions = ({
  page = 1,
  pageSize = 10,
}: { page?: number; pageSize?: number } = {}) =>
  queryOptions({
    queryKey: incomeCategoryKeys.all(),
    queryFn: async () => {
      const response = await $listIncomeCategories({ page, pageSize });
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
