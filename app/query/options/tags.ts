import { queryOptions } from "@tanstack/react-query";

import { $listTags } from "@/server/functions/tags"; // Assuming this is the function to list tags

export const tagKeys = {
  all: () => [{ scope: "tags" }] as const,
};

export const tagsListOptions = ({
  page = 1,
  pageSize = 10,
}: { page?: number; pageSize?: number } = {}) =>
  queryOptions({
    queryKey: tagKeys.all(),
    queryFn: async () => {
      const response = await $listTags({ page, pageSize });
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
