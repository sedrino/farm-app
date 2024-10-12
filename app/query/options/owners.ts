import { queryOptions } from "@tanstack/react-query";

import { $listOwners } from "@/server/functions/owners"; // Assuming this is the function to list owners

export const ownerKeys = {
  all: () => [{ scope: "owners" }] as const,
};

export const ownersListOptions = () =>
  queryOptions({
    queryKey: ownerKeys.all(),
    queryFn: async () => {
      const response = await $listOwners();
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
