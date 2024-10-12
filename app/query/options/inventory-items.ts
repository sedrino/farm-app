import { queryOptions } from "@tanstack/react-query";

import {
  $getInventoryItemById,
  $listInventoryItems,
} from "@/server/functions/inventory-items";

// Define query keys for inventory items
export const inventoryItemKeys = {
  all: () => [{ scope: "inventory-items" }] as const,
  byId: ({ itemId }: { itemId: string }) =>
    [{ ...inventoryItemKeys.all()[0], itemId }] as const,
};

// Query option for fetching a single inventory item by ID
export const inventoryItemOptions = ({ itemId }: { itemId: string }) =>
  queryOptions({
    queryKey: inventoryItemKeys.byId({ itemId }),
    queryFn: async () => {
      const response = await $getInventoryItemById({ itemId });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        throw new Error("Inventory item not found");
      }
      return response.data;
    },
  });

// Query option for fetching the list of inventory items
export const inventoryItemsListOptions = ({
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
    queryKey: inventoryItemKeys.all(),
    queryFn: async () => {
      const response = await $listInventoryItems({
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
