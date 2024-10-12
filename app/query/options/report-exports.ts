import { queryOptions } from "@tanstack/react-query";

import { $getReportExportById } from "@/server/functions/report-exports"; // Assuming this is the function to fetch report export by ID

export const reportExportKeys = {
  all: () => [{ scope: "report-exports" }] as const,
  byId: ({ reportExportId }: { reportExportId: string }) =>
    [{ ...reportExportKeys.all()[0], reportExportId }] as const,
};

export const reportExportOptions = ({
  reportExportId,
}: {
  reportExportId: string;
}) =>
  queryOptions({
    queryKey: reportExportKeys.byId({ reportExportId }),
    queryFn: async () => {
      const response = await $getReportExportById({ reportExportId });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        throw new Error("Report export not found");
      }
      return response.data;
    },
  });
