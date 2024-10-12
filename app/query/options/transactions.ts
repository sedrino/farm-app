import { queryOptions } from "@tanstack/react-query";

import { $listTransactions } from "@/server/functions/transactions"; // Assuming this is the function to list transactions

export const transactionKeys = {
  all: () => [{ scope: "transactions" }] as const,
  list: ({
    page = 1,
    pageSize = 10,
    dateRange,
    transactionType,
    category,
    amount,
  }: {
    page?: number;
    pageSize?: number;
    dateRange?: string;
    transactionType?: "income" | "expense";
    category?: string;
    amount?: number;
  } = {}) =>
    [
      {
        ...transactionKeys.all()[0],
        page,
        pageSize,
        dateRange,
        transactionType,
        category,
        amount,
      },
    ] as const,
};

export const transactionsListOptions = ({
  page = 1,
  pageSize = 10,
  dateRange,
  transactionType,
  category,
  amount,
}: {
  page?: number;
  pageSize?: number;
  dateRange?: string;
  transactionType?: "income" | "expense";
  category?: string;
  amount?: number;
}) =>
  queryOptions({
    queryKey: transactionKeys.list({
      page,
      pageSize,
      dateRange,
      transactionType,
      category,
      amount,
    }),
    queryFn: async () => {
      const response = await $listTransactions({
        page,
        pageSize,
        dateRange,
        transactionType,
        category,
        amount,
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
