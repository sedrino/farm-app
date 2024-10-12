import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { findCategories } from "@/server/db/queries/category/read";

// Define the input schema
const ListCategoriesInput = z.object({
  page: z.number().min(1).catch(1),
  pageSize: z.number().min(1).catch(50),
  type: z.enum(["income", "expense"]).catch("income"),
});

export const $listCategories = createServerFn(
  "GET",
  async (input: z.input<typeof ListCategoriesInput>) => {
    try {
      const result = ListCategoriesInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const categories = await findCategories(result.data);

      return {
        data: categories ?? [],
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
