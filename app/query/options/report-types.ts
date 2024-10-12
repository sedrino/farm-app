import { queryOptions } from "@tanstack/react-query";

import { $listReportTypes } from "@/server/functions/reports"; // Assuming this is the function to list report types

export const reportTypeKeys = {
  all: () => [{ scope: "report-types" }] as const,
};

export const reportTypesOptions = () =>
  queryOptions({
    queryKey: reportTypeKeys.all(),
    queryFn: async () => {
      const response = await $listReportTypes();
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
