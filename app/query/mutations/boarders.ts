import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { boarderKeys } from "@/query/options/boarders";
import {
  $createBoarder,
  $deleteBoarder,
  $updateBoarder,
} from "@/server/functions/boarder";

export function useCreateBoarderMutation() {
  return useMutation({
    mutationFn: async (data: Parameters<typeof $createBoarder>[0]) => {
      const result = await $createBoarder(data);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: boarderKeys.all(),
      });
    },
  });
}

export function useDeleteBoarderMutation(boarderId: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await $deleteBoarder({ boarderId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: boarderKeys.all(),
      });
    },
  });
}

export function useUpdateBoarderMutation(boarderId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $updateBoarder>[0], "boarderId">
    ) => {
      const result = await $updateBoarder({ boarderId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: boarderKeys.byId({ boarderId }),
      });
    },
  });
}
