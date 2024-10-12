import { queryOptions } from "@tanstack/react-query";

import {
  $getEventById,
  $listEvents,
  $listEventsByType,
} from "@/server/functions/events";

// Define query keys for events
export const eventKeys = {
  all: () => [{ scope: "events" }] as const,
  byId: ({ eventId }: { eventId: string }) =>
    [{ ...eventKeys.all()[0], eventId }] as const,
  listByType: ({ eventType }: { eventType: string }) =>
    [{ ...eventKeys.all()[0], eventType }] as const,
};

// Query option for fetching event details by ID
export const eventDetailsOptions = ({ eventId }: { eventId: string }) =>
  queryOptions({
    queryKey: eventKeys.byId({ eventId }),
    queryFn: async () => {
      const response = await $getEventById({ eventId });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        throw new Error("Event not found");
      }
      return response.data;
    },
  });

// Query option for fetching events by type
export const eventsListByTypeOptions = ({
  eventType,
  page,
  pageSize,
}: {
  eventType: string;
  page: number;
  pageSize: number;
}) =>
  queryOptions({
    queryKey: eventKeys.listByType({ eventType }),
    queryFn: async () => {
      const response = await $listEventsByType({
        eventType,
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

// Query option for fetching the list of events
export const eventsListOptions = ({
  page = 1,
  pageSize = 10,
}: { page?: number; pageSize?: number } = {}) =>
  queryOptions({
    queryKey: eventKeys.all(),
    queryFn: async () => {
      const response = await $listEvents({ page, pageSize });
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
