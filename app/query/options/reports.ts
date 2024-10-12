import { queryOptions } from "@tanstack/react-query";

import { $listReports, $listSavedReports } from "@/server/functions/reports";

// Query Key Factories
export const reportKeys = {
  all: () => [{ scope: "reports" }] as const,
};

export const savedReportKeys = {
  all: () => [{ scope: "saved-reports" }] as const,
};

// Query Options
export const reportsListOptions = ({
  page = 1,
  pageSize = 10,
}: { page?: number; pageSize?: number } = {}) =>
  queryOptions({
    queryKey: reportKeys.all(),
    queryFn: async () => {
      const response = await $listReports({ page, pageSize });
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

export const savedReportsListOptions = ({
  page = 1,
  pageSize = 10,
}: { page?: number; pageSize?: number } = {}) =>
  queryOptions({
    queryKey: savedReportKeys.all(),
    queryFn: async () => {
      const response = await $listSavedReports({ page, pageSize });
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
