import { queryOptions } from "@tanstack/react-query";

import { $listStallsOccupancy } from "@/server/functions/stalls";

export const stallKeys = {
  all: () => [{ scope: "stalls" }] as const,
  occupancy: ({ dateRange }: { dateRange: string }) =>
    [{ ...stallKeys.all()[0], dateRange }] as const,
};

export const stallsOccupancyOptions = ({ dateRange }: { dateRange: string }) =>
  queryOptions({
    queryKey: stallKeys.occupancy({ dateRange }),
    queryFn: async () => {
      const response = await $listStallsOccupancy({ dateRange });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        throw new Error("Stall occupancy data not found");
      }
      return response.data;
    },
  });
