import { queryOptions } from "@tanstack/react-query";

import { $listNotifications } from "@/server/functions/notifications"; // Assuming this is the function to list notifications

export const notificationKeys = {
  all: () => [{ scope: "notifications" }] as const,
};

export const notificationsListOptions = ({
  page = 1,
  pageSize = 10,
}: { page?: number; pageSize?: number } = {}) =>
  queryOptions({
    queryKey: notificationKeys.all(),
    queryFn: async () => {
      const response = await $listNotifications({ page, pageSize });
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
