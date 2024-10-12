import { queryOptions } from "@tanstack/react-query";

import { $getInvoiceById, $listInvoices } from "@/server/functions/invoices";

// Define query keys for invoices
export const invoiceKeys = {
  all: () => [{ scope: "invoices" }] as const,
  byId: ({ invoiceId }: { invoiceId: string }) =>
    [{ ...invoiceKeys.all()[0], invoiceId }] as const,
};

// Query option for fetching a single invoice by ID
export const invoiceOptions = ({ invoiceId }: { invoiceId: string }) =>
  queryOptions({
    queryKey: invoiceKeys.byId({ invoiceId }),
    queryFn: async () => {
      const response = await $getInvoiceById({ invoiceId });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        throw new Error("Invoice not found");
      }
      return response.data;
    },
  });

// Query option for fetching a list of invoices
export const invoicesListOptions = ({
  page,
  pageSize,
  dateRange,
  boarder,
  paymentStatus,
}: {
  page: number;
  pageSize: number;
  dateRange?: string;
  boarder?: string;
  paymentStatus?: "paid" | "unpaid" | "overdue";
}) =>
  queryOptions({
    queryKey: invoiceKeys.all(),
    queryFn: async () => {
      const response = await $listInvoices({
        page,
        pageSize,
        dateRange,
        boarder,
        paymentStatus,
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
