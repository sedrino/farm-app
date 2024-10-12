import { queryOptions } from "@tanstack/react-query";

import { $listExerciseReports } from "@/server/functions/exercise-reports"; // Assuming this is the function to list exercise reports

export const exerciseReportKeys = {
  all: () => [{ scope: "exercise-reports" }] as const,
};

export const exerciseReportsListOptions = ({
  page = 1,
  pageSize = 10,
}: { page?: number; pageSize?: number } = {}) =>
  queryOptions({
    queryKey: exerciseReportKeys.all(),
    queryFn: async () => {
      const response = await $listExerciseReports({ page, pageSize });
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
