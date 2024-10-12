import { queryOptions } from "@tanstack/react-query";

import {
  $getBoarderBilling,
  $getBoarderById,
  $listBoarders,
} from "@/server/functions/boarders";

// Define query keys for boarders
export const boarderKeys = {
  all: () => [{ scope: "boarders" }] as const,
  byId: ({ boarderId }: { boarderId: string }) =>
    [{ ...boarderKeys.all()[0], boarderId }] as const,
  billing: ({ boarderId }: { boarderId: string }) =>
    [{ ...boarderKeys.byId({ boarderId })[0], action: "billing" }] as const,
};

// Query option for fetching boarder billing information
export const boarderBillingOptions = ({ boarderId }: { boarderId: string }) =>
  queryOptions({
    queryKey: boarderKeys.billing({ boarderId }),
    queryFn: async () => {
      const response = await $getBoarderBilling({ boarderId });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        throw new Error("Boarder billing information not found");
      }
      return response.data;
    },
  });

// Query option for fetching boarder details
export const boarderDetailsOptions = ({ boarderId }: { boarderId: string }) =>
  queryOptions({
    queryKey: boarderKeys.byId({ boarderId }),
    queryFn: async () => {
      const response = await $getBoarderById({ boarderId });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        throw new Error("Boarder not found");
      }
      return response.data;
    },
  });

// Query option for fetching the list of boarders
export const boardersListOptions = ({
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
    queryKey: boarderKeys.all(),
    queryFn: async () => {
      const response = await $listBoarders({
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
