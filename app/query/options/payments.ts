import { queryOptions } from "@tanstack/react-query";

import { $listPayments } from "@/server/functions/payments"; // Assuming this is the function to list payments

export const paymentKeys = {
  all: () => [{ scope: "payments" }] as const,
  list: (opts: {
    page?: number;
    pageSize?: number;
    dateRange?: string;
    boarderId?: string;
    paymentMethod?: string;
  }) => [{ ...paymentKeys.all()[0], opts }] as const,
};

export const paymentsListOptions = (opts: {
  page?: number;
  pageSize?: number;
  dateRange?: string;
  boarderId?: string;
  paymentMethod?: string;
}) =>
  queryOptions({
    queryKey: paymentKeys.list(opts),
    queryFn: async () => {
      const response = await $listPayments(opts);
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
