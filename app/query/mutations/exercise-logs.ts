import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { exerciseLogKeys } from "@/query/options/exercise-logs";
import {
  $createExerciseLog,
  $deleteExerciseLog,
} from "@/server/functions/exercise-log";

export function useCreateExerciseLogMutation(horseId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $createExerciseLog>[0], "horseId">
    ) => {
      const result = await $createExerciseLog({ horseId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: exerciseLogKeys.list({ horseId }),
      });
    },
  });
}

export function useDeleteExerciseLogMutation(exerciseLogId: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await $deleteExerciseLog({ exerciseLogId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: exerciseLogKeys.all(),
      });
    },
  });
}
