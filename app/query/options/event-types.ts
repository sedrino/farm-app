import { queryOptions } from "@tanstack/react-query";

import { $listEventTypes } from "@/server/functions/event-types"; // Assuming this is the function to list event types

export const eventTypeKeys = {
  all: () => [{ scope: "event-types" }] as const,
};

export const eventTypesListOptions = ({
  page = 1,
  pageSize = 10,
}: { page?: number; pageSize?: number } = {}) =>
  queryOptions({
    queryKey: eventTypeKeys.all(),
    queryFn: async () => {
      const response = await $listEventTypes({ page, pageSize });
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
