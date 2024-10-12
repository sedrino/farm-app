import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  addInventoryItem,
  deleteInventoryItem,
  duplicateInventoryItem,
  updateInventoryItem,
} from "@/server/db/queries/inventory-item/write";

// Define the input schema
const CreateInventoryItemInput = z.object({
  item: z.object({
    name: z.string().min(1, "Item name is required"),
    description: z.string().optional(),
    categoryId: z.string().min(1, "Category is required"),
    subcategoryId: z.string().optional(),
    quantity: z.number().min(1, "Quantity is required"),
    unitOfMeasurement: z.string().min(1, "Unit of measurement is required"),
    reorderPoint: z.number().min(0, "Reorder point is required"),
    preferredSupplierId: z.string().optional(),
    costPerUnit: z.number().min(0, "Cost per unit is required"),
    storageLocation: z.string().optional(),
    imageUrl: z.string().optional(),
  }),
});

export const $createInventoryItem = createServerFn(
  "POST",
  async (input: z.input<typeof CreateInventoryItemInput>) => {
    try {
      const result = CreateInventoryItemInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const inventoryItem = await addInventoryItem(result.data);

      return {
        inventoryItem,
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

// Define the input schema
const DeleteInventoryItemInput = z.object({
  itemId: z.string().min(1, "Item ID is required"),
});

export const $deleteInventoryItem = createServerFn(
  "POST",
  async (input: z.input<typeof DeleteInventoryItemInput>) => {
    try {
      const result = DeleteInventoryItemInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      await deleteInventoryItem(result.data.itemId);

      return {
        success: true,
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

// Define the input schema
const DuplicateInventoryItemInput = z.object({
  itemId: z.string().min(1, "Item ID is required"),
});

export const $duplicateInventoryItem = createServerFn(
  "POST",
  async (input: z.input<typeof DuplicateInventoryItemInput>) => {
    try {
      const result = DuplicateInventoryItemInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const duplicatedItem = await duplicateInventoryItem(result.data.itemId);

      return {
        duplicatedItem,
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

// Define the input schema
const UpdateInventoryItemInput = z.object({
  itemId: z.string().min(1, "Item ID is required"),
  item: z.object({
    name: z.string().min(1, "Name is required"),
    category: z.string().min(1, "Category is required"),
    quantity: z.number().min(0, "Quantity must be at least 0"),
    unitOfMeasurement: z.string().min(1, "Unit of Measurement is required"),
    reorderPoint: z.number().min(0, "Reorder Point must be at least 0"),
    supplier: z.string().optional(),
    notes: z.string().optional(),
    lastUpdated: z.number().optional(),
    valuePerUnit: z.number().optional(),
    lowStockThreshold: z.number().optional(),
    location: z.string().optional(),
    description: z.string().optional(),
    subcategory: z.string().optional(),
    costPerUnit: z.number().optional(),
  }),
});

export const $updateInventoryItem = createServerFn(
  "POST",
  async (input: z.input<typeof UpdateInventoryItemInput>) => {
    try {
      const result = UpdateInventoryItemInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const updatedItem = await updateInventoryItem(result.data);

      return {
        item: updatedItem,
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
