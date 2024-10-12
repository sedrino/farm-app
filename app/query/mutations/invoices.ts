import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { invoiceKeys } from "@/query/options/invoices";
import {
  $createInvoice,
  $editInvoice,
  $markInvoicePaid,
  $sendInvoice,
} from "@/server/functions/invoice";

export function useCreateInvoiceMutation() {
  return useMutation({
    mutationFn: async (data: Parameters<typeof $createInvoice>[0]) => {
      const result = await $createInvoice(data);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: invoiceKeys.all(),
      });
    },
  });
}

export function useEditInvoiceMutation(invoiceId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $editInvoice>[0], "invoiceId">
    ) => {
      const result = await $editInvoice({ invoiceId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: invoiceKeys.byId({ invoiceId }),
      });
    },
  });
}

export function useMarkInvoicePaidMutation(invoiceId: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await $markInvoicePaid({ invoiceId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: invoiceKeys.byId({ invoiceId }),
      });
    },
  });
}

export function useSendInvoiceMutation(invoiceId: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await $sendInvoice({ invoiceId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: invoiceKeys.byId({ invoiceId }),
      });
    },
  });
}
