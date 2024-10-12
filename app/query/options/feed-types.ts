import { queryOptions } from "@tanstack/react-query";

import { $listFeedTypes } from "@/server/functions/feed-types"; // Assuming this is the function to list feed types

export const feedTypeKeys = {
  all: () => [{ scope: "feed-types" }] as const,
};

export const feedTypesListOptions = ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) =>
  queryOptions({
    queryKey: feedTypeKeys.all(),
    queryFn: async () => {
      const response = await $listFeedTypes({ page, pageSize });
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
