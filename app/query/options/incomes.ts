import { queryOptions } from "@tanstack/react-query";

import {
  $getIncomeById,
  $listIncomes,
  $listIncomesPaginated,
} from "@/server/functions/incomes";

// Define query keys for income-related queries
export const incomeKeys = {
  all: () => [{ scope: "incomes" }] as const,
  byId: ({ incomeId }: { incomeId: string }) =>
    [{ ...incomeKeys.all()[0], incomeId }] as const,
};

// Query option for fetching income details by ID
export const incomeDetailsOptions = ({ incomeId }: { incomeId: string }) =>
  queryOptions({
    queryKey: incomeKeys.byId({ incomeId }),
    queryFn: async () => {
      const response = await $getIncomeById({ incomeId });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        throw new Error("Income not found");
      }
      return response.data;
    },
  });

// Query option for fetching a list of incomes
export const incomeListOptions = ({
  page = 1,
  pageSize = 10,
  month,
  year,
}: { page?: number; pageSize?: number; month?: number; year?: number } = {}) =>
  queryOptions({
    queryKey: incomeKeys.all(),
    queryFn: async () => {
      const response = await $listIncomes({
        page,
        pageSize,
        month,
        year,
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

// Query option for fetching a paginated list of incomes
export const incomesListOptions = ({
  page = 1,
  pageSize = 10,
  dateRange,
  category,
  source,
}: {
  page?: number;
  pageSize?: number;
  dateRange?: string;
  category?: string;
  source?: string;
} = {}) =>
  queryOptions({
    queryKey: incomeKeys.all(),
    queryFn: async () => {
      const response = await $listIncomesPaginated({
        page,
        pageSize,
        dateRange,
        category,
        source,
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

// Query option for fetching a single income entry by ID
export const incomeOptions = ({ incomeId }: { incomeId: string }) =>
  queryOptions({
    queryKey: incomeKeys.byId({ incomeId }),
    queryFn: async () => {
      const response = await $getIncomeById({ incomeId });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        throw new Error("Income not found");
      }
      return response.data;
    },
  });
