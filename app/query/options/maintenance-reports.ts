import { queryOptions } from "@tanstack/react-query";

import { $listMaintenanceReports } from "@/server/functions/reports"; // Assuming this is the function to list maintenance reports

export const maintenanceReportKeys = {
  all: () => [{ scope: "maintenance-reports" }] as const,
  byId: ({ reportId }: { reportId: string }) =>
    [{ ...maintenanceReportKeys.all()[0], reportId }] as const,
};

export const maintenanceReportOptions = ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) =>
  queryOptions({
    queryKey: maintenanceReportKeys.all(),
    queryFn: async () => {
      const response = await $listMaintenanceReports({ page, pageSize });
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
