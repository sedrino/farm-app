import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { deleteIncomeCategory } from "@/server/db/queries/income-category/write";

// Define the input schema
const DeleteIncomeCategoryInput = z.object({
  categoryId: z.string().min(1, "Category ID is required"),
});

export const $deleteIncomeCategory = createServerFn(
  "POST",
  async (input: z.input<typeof DeleteIncomeCategoryInput>) => {
    try {
      const result = DeleteIncomeCategoryInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      await deleteIncomeCategory(result.data.categoryId);

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
