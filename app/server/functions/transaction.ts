import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { deleteTransaction } from "@/server/db/queries/transaction/write";

// Define the input schema
const DeleteTransactionInput = z.object({
  transactionId: z.string().min(1, "Transaction ID is required"),
});

export const $deleteTransaction = createServerFn(
  "POST",
  async (input: z.input<typeof DeleteTransactionInput>) => {
    try {
      const result = DeleteTransactionInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      await deleteTransaction(result.data.transactionId);

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
