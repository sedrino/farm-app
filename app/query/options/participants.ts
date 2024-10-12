import { queryOptions } from "@tanstack/react-query";

import { $listParticipants } from "@/server/functions/participants"; // Assuming this is the function to list participants

export const participantKeys = {
  all: () => [{ scope: "participants" }] as const,
};

export const participantsListOptions = ({
  page = 1,
  pageSize = 10,
}: { page?: number; pageSize?: number } = {}) =>
  queryOptions({
    queryKey: participantKeys.all(),
    queryFn: async () => {
      const response = await $listParticipants({ page, pageSize });
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
