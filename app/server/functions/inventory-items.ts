import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  findInventoryItems,
  getInventoryItemById,
} from "@/server/db/queries/inventory-item/read";

// Define the input schema
const GetInventoryItemByIdInput = z.object({
  itemId: z.string().min(1, "Item ID is required"),
});

export const $getInventoryItemById = createServerFn(
  "GET",
  async (input: z.input<typeof GetInventoryItemByIdInput>) => {
    try {
      const result = GetInventoryItemByIdInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const inventoryItem = await getInventoryItemById(result.data.itemId);

      return {
        data: inventoryItem ?? null, // Return null if no item is found
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          error: error.message,
        };
      } else {
        return {
          error: "Unknown error",
        };
      }
    }
  }
);

// Define the input schema for listing inventory items
const ListInventoryItemsInput = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.string().optional(),
  sort: z.enum(["name", "category", "quantity"]).optional(),
});

export const $listInventoryItems = createServerFn(
  "GET",
  async (input: z.input<typeof ListInventoryItemsInput>) => {
    try {
      const result = ListInventoryItemsInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const inventoryItems = await findInventoryItems(result.data);

      return {
        data: inventoryItems ?? [],
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          error: error.message,
        };
      } else {
        return {
          error: "Unknown error",
        };
      }
    }
  }
);
