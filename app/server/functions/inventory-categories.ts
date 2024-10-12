import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { findInventoryCategories } from "@/server/db/queries/inventory-category/read";

// Define the input schema
const ListInventoryCategoriesInput = z.object({
  page: z.number().min(1).catch(1),
  pageSize: z.number().min(1).catch(10),
  search: z.string().optional(),
});

export const $listInventoryCategories = createServerFn(
  "GET",
  async (input: z.input<typeof ListInventoryCategoriesInput>) => {
    try {
      const result = ListInventoryCategoriesInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const inventoryCategories = await findInventoryCategories(result.data);

      return {
        data: inventoryCategories ?? [],
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
