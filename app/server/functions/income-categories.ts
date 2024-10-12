import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { findIncomeCategories } from "@/server/db/queries/income-category/read";

// Define the input schema
const ListIncomeCategoriesInput = z.object({});

export const $listIncomeCategories = createServerFn(
  "GET",
  async (input: z.input<typeof ListIncomeCategoriesInput>) => {
    try {
      const result = ListIncomeCategoriesInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const incomeCategories = await findIncomeCategories();

      return {
        data: incomeCategories ?? [], // Return an empty array if no data is found
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
