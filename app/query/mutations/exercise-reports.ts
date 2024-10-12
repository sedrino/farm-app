import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { exerciseReportKeys } from "@/query/options/exercise-reports";
import { $deleteExerciseReport } from "@/server/functions/exercise-report";

export function useDeleteExerciseReportMutation(reportId: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await $deleteExerciseReport({ reportId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: exerciseReportKeys.all(),
      });
    },
  });
}
