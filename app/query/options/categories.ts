import { queryOptions } from "@tanstack/react-query";

import { $listCategories } from "@/server/functions/categories"; // Assuming this is the function to list categories

export const categoryKeys = {
  all: () => [{ scope: "categories" }] as const,
  byType: ({ type }: { type: "income" | "expense" }) =>
    [{ ...categoryKeys.all()[0], type }] as const,
};

export const categoriesListOptions = ({
  page,
  pageSize,
  type,
}: {
  page: number;
  pageSize: number;
  type: "income" | "expense";
}) =>
  queryOptions({
    queryKey: categoryKeys.byType({ type }),
    queryFn: async () => {
      const response = await $listCategories({ page, pageSize, type });
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
