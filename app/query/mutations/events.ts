import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { eventKeys } from "@/query/options/events";
import {
  $cancelRegistration,
  $createEvent,
  $deleteEvent,
  $updateEvent,
} from "@/server/functions/event";

export function useCancelRegistrationMutation(eventId: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await $cancelRegistration({ eventId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: eventKeys.byId({ eventId }),
      });
    },
  });
}

export function useCreateEventMutation() {
  return useMutation({
    mutationFn: async (data: Parameters<typeof $createEvent>[0]) => {
      const result = await $createEvent(data);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: eventKeys.all(),
      });
    },
  });
}

export function useDeleteEventMutation(eventId: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await $deleteEvent({ eventId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: eventKeys.all(),
      });
    },
  });
}

export function useUpdateEventMutation(eventId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $updateEvent>[0], "eventId">
    ) => {
      const result = await $updateEvent({ eventId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: eventKeys.byId({ eventId }),
      });
    },
  });
}
