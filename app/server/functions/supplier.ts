import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { deleteSupplier } from "@/server/db/queries/supplier/write";

// Define the input schema
const DeleteSupplierInput = z.object({
  supplierId: z.string().min(1, "Supplier ID is required"),
});

export const $deleteSupplier = createServerFn(
  "POST",
  async (input: z.input<typeof DeleteSupplierInput>) => {
    try {
      const result = DeleteSupplierInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      await deleteSupplier(result.data.supplierId);

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
