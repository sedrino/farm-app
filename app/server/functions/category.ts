import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { deleteCategory } from "@/server/db/queries/category/write";

// Define the input schema
const DeleteCategoryInput = z.object({
  categoryId: z.string().min(1, "Category ID is required"),
});

export const $deleteCategory = createServerFn(
  "POST",
  async (input: z.input<typeof DeleteCategoryInput>) => {
    try {
      const result = DeleteCategoryInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      await deleteCategory(result.data.categoryId);

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
