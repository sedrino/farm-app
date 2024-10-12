import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { visitorKeys } from "@/query/options/visitors";
import {
  $checkInVisitor,
  $createVisitor,
  $deleteVisitor,
} from "@/server/functions/visitor";

export function useCheckInVisitorMutation(visitorId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $checkInVisitor>[0], "visitorId">
    ) => {
      const result = await $checkInVisitor({ visitorId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: visitorKeys.byId({ visitorId }),
      });
    },
  });
}

export function useCreateVisitorMutation() {
  return useMutation({
    mutationFn: async (data: Parameters<typeof $createVisitor>[0]) => {
      const result = await $createVisitor(data);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: visitorKeys.all(),
      });
    },
  });
}

export function useDeleteVisitorMutation(visitorId: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await $deleteVisitor({ visitorId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: visitorKeys.all(),
      });
    },
  });
}
