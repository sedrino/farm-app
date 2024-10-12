import { queryOptions } from "@tanstack/react-query";

import { $listCustomizationTypes } from "@/server/functions/customization-types"; // Assuming this is the function to list customization types

export const customizationTypeKeys = {
  all: () => [{ scope: "customization-types" }] as const,
};

export const customizationTypesListOptions = () =>
  queryOptions({
    queryKey: customizationTypeKeys.all(),
    queryFn: async () => {
      const response = await $listCustomizationTypes();
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
