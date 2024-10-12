import { queryOptions } from "@tanstack/react-query";

import {
  $getStallById,
  $getStallsMap,
  $listStalls,
} from "@/server/functions/stalls";

// Query Key Factories
export const stallKeys = {
  all: () => [{ scope: "stalls" }] as const,
  byId: ({ stallId }: { stallId: string }) =>
    [{ ...stallKeys.all()[0], stallId }] as const,
  map: ({ barnId }: { barnId: string }) =>
    [{ ...stallKeys.all()[0], barnId }] as const,
};

// Query Options
export const stallDetailsOptions = ({ stallId }: { stallId: string }) =>
  queryOptions({
    queryKey: stallKeys.byId({ stallId }),
    queryFn: async () => {
      const response = await $getStallById({ stallId });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        throw new Error("Stall not found");
      }
      return response.data;
    },
  });

export const stallsListOptions = ({
  page,
  pageSize,
  search,
  sort,
}: {
  page: number;
  pageSize: number;
  search?: string;
  sort?: string;
}) =>
  queryOptions({
    queryKey: stallKeys.all(),
    queryFn: async () => {
      const response = await $listStalls({
        page,
        pageSize,
        search,
        sort,
      });
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

export const stallsMapOptions = ({ barnId }: { barnId: string }) =>
  queryOptions({
    queryKey: stallKeys.map({ barnId }),
    queryFn: async () => {
      const response = await $getStallsMap({ barnId });
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
