import { queryOptions } from "@tanstack/react-query";

import { $listExerciseSessions } from "@/server/functions/exercise-sessions"; // Assuming this is the function to list exercise sessions

export const exerciseSessionKeys = {
  all: () => [{ scope: "exercise-sessions" }] as const,
  list: ({
    page,
    pageSize,
    horseId,
    exerciseTypeId,
    trainerId,
    dateRange,
  }: {
    page: number;
    pageSize: number;
    horseId?: string;
    exerciseTypeId?: string;
    trainerId?: string;
    dateRange?: string;
  }) =>
    [
      {
        ...exerciseSessionKeys.all()[0],
        page,
        pageSize,
        horseId,
        exerciseTypeId,
        trainerId,
        dateRange,
      },
    ] as const,
};

export const exerciseSessionsListOptions = ({
  page,
  pageSize,
  horseId,
  exerciseTypeId,
  trainerId,
  dateRange,
}: {
  page: number;
  pageSize: number;
  horseId?: string;
  exerciseTypeId?: string;
  trainerId?: string;
  dateRange?: string;
}) =>
  queryOptions({
    queryKey: exerciseSessionKeys.list({
      page,
      pageSize,
      horseId,
      exerciseTypeId,
      trainerId,
      dateRange,
    }),
    queryFn: async () => {
      const response = await $listExerciseSessions({
        page,
        pageSize,
        horseId,
        exerciseTypeId,
        trainerId,
        dateRange,
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
