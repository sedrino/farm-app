import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { findBudgetCategories } from "@/server/db/queries/budget-category/read";

// Define the input schema
const ListBudgetCategoriesInput = z.object({});

export const $listBudgetCategories = createServerFn(
  "GET",
  async (input: z.input<typeof ListBudgetCategoriesInput>) => {
    try {
      const result = ListBudgetCategoriesInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const budgetCategories = await findBudgetCategories();

      return {
        data: budgetCategories ?? [], // Return an empty array if no categories are found
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
