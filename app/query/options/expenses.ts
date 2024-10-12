import { queryOptions } from "@tanstack/react-query";

import {
  $getExpenseById,
  $listExpenses,
  $listExpensesPaginated,
} from "@/server/functions/expenses";

// Define query keys for expenses
export const expenseKeys = {
  all: () => [{ scope: "expenses" }] as const,
  list: ({ page, pageSize }: { page: number; pageSize: number }) =>
    [{ ...expenseKeys.all()[0], page, pageSize }] as const,
  byId: ({ expenseId }: { expenseId: string }) =>
    [{ ...expenseKeys.all()[0], expenseId }] as const,
};

// Query option for listing expenses
export const expenseListOptions = ({
  page = 1,
  pageSize = 10,
  dateRange,
  category,
  vendor,
}: {
  page?: number;
  pageSize?: number;
  dateRange?: string;
  category?: string;
  vendor?: string;
}) =>
  queryOptions({
    queryKey: expenseKeys.list({ page, pageSize }),
    queryFn: async () => {
      const response = await $listExpenses({
        page,
        pageSize,
        dateRange,
        category,
        vendor,
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

// Query option for fetching a single expense by ID
export const expenseOptions = ({ expenseId }: { expenseId: string }) =>
  queryOptions({
    queryKey: expenseKeys.byId({ expenseId }),
    queryFn: async () => {
      const response = await $getExpenseById({ expenseId });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        throw new Error("Expense not found");
      }
      return response.data;
    },
  });

// Query option for listing expenses with pagination
export const expensesListOptions = ({
  page = 1,
  pageSize = 10,
  dateRange,
  category,
  vendor,
}: {
  page?: number;
  pageSize?: number;
  dateRange?: string;
  category?: string;
  vendor?: string;
}) =>
  queryOptions({
    queryKey: expenseKeys.list({ page, pageSize }),
    queryFn: async () => {
      const response = await $listExpensesPaginated({
        page,
        pageSize,
        dateRange,
        category,
        vendor,
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
