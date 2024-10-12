import { queryOptions } from "@tanstack/react-query";

import { $getVisitorById, $listVisitors } from "@/server/functions/visitors";

// Define query keys for visitors
export const visitorKeys = {
  all: () => [{ scope: "visitors" }] as const,
  byId: ({ visitorId }: { visitorId: string }) =>
    [{ ...visitorKeys.all()[0], visitorId }] as const,
};

// Query option for fetching visitor details by ID
export const visitorDetailsOptions = ({ visitorId }: { visitorId: string }) =>
  queryOptions({
    queryKey: visitorKeys.byId({ visitorId }),
    queryFn: async () => {
      const response = await $getVisitorById({ visitorId });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        throw new Error("Visitor not found");
      }
      return response.data;
    },
  });

// Query option for fetching the list of visitors
export const visitorsListOptions = ({
  page,
  pageSize,
  search,
  sort,
}: {
  page: number;
  pageSize: number;
  search?: string;
  sort?: "name" | "type" | "date";
}) =>
  queryOptions({
    queryKey: visitorKeys.all(),
    queryFn: async () => {
      const response = await $listVisitors({
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
