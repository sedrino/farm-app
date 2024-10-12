import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { inventoryItemKeys } from "@/query/options/inventory-items";
import {
  $createInventoryItem,
  $deleteInventoryItem,
  $duplicateInventoryItem,
  $updateInventoryItem,
} from "@/server/functions/inventory-item";

export function useCreateInventoryItemMutation() {
  return useMutation({
    mutationFn: async (data: Parameters<typeof $createInventoryItem>[0]) => {
      const result = await $createInventoryItem(data);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inventoryItemKeys.all(),
      });
    },
  });
}

export function useDeleteInventoryItemMutation(itemId: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await $deleteInventoryItem({ itemId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inventoryItemKeys.all(),
      });
    },
  });
}

export function useDuplicateInventoryItemMutation(itemId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $duplicateInventoryItem>[0], "itemId">
    ) => {
      const result = await $duplicateInventoryItem({ itemId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inventoryItemKeys.all(),
      });
    },
  });
}

export function useUpdateInventoryItemMutation(itemId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $updateInventoryItem>[0], "itemId">
    ) => {
      const result = await $updateInventoryItem({ itemId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inventoryItemKeys.byId({ itemId }),
      });
    },
  });
}
