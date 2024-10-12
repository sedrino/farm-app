import { queryOptions } from "@tanstack/react-query";

import { $listContractTemplates } from "@/server/functions/contract-templates"; // Assuming this is the function to list contract templates

export const contractTemplateKeys = {
  all: () => [{ scope: "contract-templates" }] as const,
};

export const contractTemplatesListOptions = ({
  page = 1,
  pageSize = 10,
  search,
}: { page?: number; pageSize?: number; search?: string } = {}) =>
  queryOptions({
    queryKey: contractTemplateKeys.all(),
    queryFn: async () => {
      const response = await $listContractTemplates({
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
