import { queryOptions } from "@tanstack/react-query";

import { $listExerciseTypes } from "@/server/functions/exercise-types"; // Assuming this is the function to list exercise types

export const exerciseTypeKeys = {
  all: () => [{ scope: "exercise-types" }] as const,
};

export const exerciseTypesListOptions = ({
  page = 1,
  pageSize = 10,
}: { page?: number; pageSize?: number } = {}) =>
  queryOptions({
    queryKey: exerciseTypeKeys.all(),
    queryFn: async () => {
      const response = await $listExerciseTypes({ page, pageSize });
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
