import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { exerciseSessionKeys } from "@/query/options/exercise-sessions";
import { $deleteExerciseSession } from "@/server/functions/exercise-session";

export function useDeleteExerciseSessionMutation(sessionId: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await $deleteExerciseSession({ sessionId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: exerciseSessionKeys.all(),
      });
    },
  });
}
