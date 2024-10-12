import { queryOptions } from "@tanstack/react-query";

import { $listSuppliers } from "@/server/functions/suppliers"; // Assuming this is the function to list suppliers

export const supplierKeys = {
  all: () => [{ scope: "suppliers" }] as const,
  list: ({
    page,
    pageSize,
    search,
  }: {
    page: number;
    pageSize: number;
    search?: string;
  }) => [{ ...supplierKeys.all()[0], page, pageSize, search }] as const,
};

export const suppliersListOptions = ({
  page,
  pageSize,
  search,
}: {
  page: number;
  pageSize: number;
  search?: string;
}) =>
  queryOptions({
    queryKey: supplierKeys.list({ page, pageSize, search }),
    queryFn: async () => {
      const response = await $listSuppliers({ page, pageSize, search });
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
