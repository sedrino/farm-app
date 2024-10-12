import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { messageKeys } from "@/query/options/messages";
import { $deleteMessage, $flagMessage } from "@/server/functions/message";

export function useDeleteMessageMutation(messageId: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await $deleteMessage({ messageId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: messageKeys.all(),
      });
    },
  });
}

export function useFlagMessageMutation(messageId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $flagMessage>[0], "messageId">
    ) => {
      const result = await $flagMessage({ messageId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: messageKeys.all(),
      });
    },
  });
}
