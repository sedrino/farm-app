import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { findSuppliers } from "@/server/db/queries/supplier/read";

// Define the input schema
const ListSuppliersInput = z.object({
  page: z.number().min(1).catch(1),
  pageSize: z.number().min(1).catch(50),
  search: z.string().optional(),
});

export const $listSuppliers = createServerFn(
  "GET",
  async (input: z.input<typeof ListSuppliersInput>) => {
    try {
      const result = ListSuppliersInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const suppliers = await findSuppliers(result.data);

      return {
        data: suppliers ?? [],
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
