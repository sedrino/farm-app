import { queryOptions } from "@tanstack/react-query";

import {
  $getBudgetById,
  $listBudgets,
  $updateBudget,
} from "@/server/functions/budgets";

// Query Key Factories
export const budgetKeys = {
  all: () => [{ scope: "budgets" }] as const,
  byId: ({ budgetId }: { budgetId: string }) =>
    [{ ...budgetKeys.all()[0], budgetId }] as const,
};

// Query Options
export const budgetDetailsOptions = ({ budgetId }: { budgetId: string }) =>
  queryOptions({
    queryKey: budgetKeys.byId({ budgetId }),
    queryFn: async () => {
      const response = await $getBudgetById({ budgetId });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        throw new Error("Budget not found");
      }
      return response.data;
    },
  });

export const budgetsListOptions = ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) =>
  queryOptions({
    queryKey: budgetKeys.all(),
    queryFn: async () => {
      const response = await $listBudgets({ page, pageSize });
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
