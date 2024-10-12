import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { findExpenseCategories } from "@/server/db/queries/expense-category/read";

// Define the input schema
const ListExpenseCategoriesInput = z.object({});

export const $listExpenseCategories = createServerFn(
  "GET",
  async (input: z.input<typeof ListExpenseCategoriesInput>) => {
    try {
      const result = ListExpenseCategoriesInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const expenseCategories = await findExpenseCategories();

      return {
        data: expenseCategories ?? [], // Return an empty array if no data is found
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
