import { queryOptions } from "@tanstack/react-query";

import { $listStallFeatures } from "@/server/functions/stalls"; // Assuming this is the function to fetch stall features

export const stallFeatureKeys = {
  all: () => [{ scope: "stall-features" }] as const,
};

export const stallFeaturesListOptions = ({
  page = 1,
  pageSize = 10,
}: { page?: number; pageSize?: number } = {}) =>
  queryOptions({
    queryKey: stallFeatureKeys.all(),
    queryFn: async () => {
      const response = await $listStallFeatures({ page, pageSize });
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
