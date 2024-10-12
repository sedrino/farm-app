import { queryOptions } from "@tanstack/react-query";

import { $listExerciseLogs } from "@/server/functions/exercise-logs"; // Assuming this is the function to list exercise logs

export const exerciseLogKeys = {
  all: () => [{ scope: "exercise-logs" }] as const,
  list: ({ horseId }: { horseId: string }) =>
    [{ ...exerciseLogKeys.all()[0], horseId }] as const,
};

export const exerciseLogsListOptions = ({
  horseId,
  page = 1,
  pageSize = 10,
}: { horseId: string; page?: number; pageSize?: number } = {}) =>
  queryOptions({
    queryKey: exerciseLogKeys.list({ horseId }),
    queryFn: async () => {
      const response = await $listExerciseLogs({
        horseId,
        page,
        pageSize,
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
