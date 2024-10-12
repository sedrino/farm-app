import { queryOptions } from "@tanstack/react-query";

import { $getFinancialReportById } from "@/server/functions/financial-reports"; // Assuming this is the function to fetch the report

export const financialReportKeys = {
  all: () => [{ scope: "financial-reports" }] as const,
  byId: ({ reportId }: { reportId: string }) =>
    [{ ...financialReportKeys.all()[0], reportId }] as const,
};

export const financialReportOptions = ({ reportId }: { reportId: string }) =>
  queryOptions({
    queryKey: financialReportKeys.byId({ reportId }),
    queryFn: async () => {
      const response = await $getFinancialReportById({ reportId });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        throw new Error("Financial report not found");
      }
      return response.data;
    },
  });
