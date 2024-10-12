import { queryOptions } from "@tanstack/react-query";

import { $listInventoryCategories } from "@/server/functions/inventory-categories"; // Assuming this is the function to list inventory categories

export const inventoryCategoryKeys = {
  all: () => [{ scope: "inventory-categories" }] as const,
  list: ({
    page,
    pageSize,
    search,
  }: {
    page?: number;
    pageSize?: number;
    search?: string;
  }) =>
    [{ ...inventoryCategoryKeys.all()[0], page, pageSize, search }] as const,
};

export const inventoryCategoriesListOptions = ({
  page = 1,
  pageSize = 10,
  search,
}: { page?: number; pageSize?: number; search?: string } = {}) =>
  queryOptions({
    queryKey: inventoryCategoryKeys.list({ page, pageSize, search }),
    queryFn: async () => {
      const response = await $listInventoryCategories({
        page,
        pageSize,
        search,
      });
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
