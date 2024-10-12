import { queryOptions } from "@tanstack/react-query";

import { $listReportExports } from "@/server/functions/report-exports"; // Assuming this is the function to list report exports

export const reportExportKeys = {
  all: () => [{ scope: "report-exports" }] as const,
};

export const reportExportOptions = () =>
  queryOptions({
    queryKey: reportExportKeys.all(),
    queryFn: async () => {
      const response = await $listReportExports();
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
