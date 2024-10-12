import { queryOptions } from "@tanstack/react-query";

import { $listDataPoints } from "@/server/functions/data-points"; // Assuming this is the function to list data points

export const dataPointKeys = {
  all: () => [{ scope: "data-points" }] as const,
};

export const dataPointsListOptions = ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) =>
  queryOptions({
    queryKey: dataPointKeys.all(),
    queryFn: async () => {
      const response = await $listDataPoints({ page, pageSize });
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
