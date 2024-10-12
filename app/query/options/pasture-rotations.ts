import { queryOptions } from "@tanstack/react-query";

import { $listPastureRotations } from "@/server/functions/pasture-rotations"; // Assuming this is the function to list pasture rotations

export const pastureRotationKeys = {
  all: () => [{ scope: "pasture-rotations" }] as const,
};

export const pastureRotationsListOptions = ({
  page = 1,
  pageSize = 10,
}: { page?: number; pageSize?: number } = {}) =>
  queryOptions({
    queryKey: pastureRotationKeys.all(),
    queryFn: async () => {
      const response = await $listPastureRotations({ page, pageSize });
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
