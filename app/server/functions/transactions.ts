import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  findTransactionsCount,
  findTransactionsPaginated,
} from "@/server/db/queries/transaction/read";

// Define the input schema
const ListTransactionsInput = z.object({
  page: z.number().min(1).catch(1),
  pageSize: z.number().min(1).catch(10),
  dateRange: z.string().optional(),
  transactionType: z.enum(["income", "expense"]).optional(),
  category: z.string().optional(),
  amount: z.number().optional(),
});

export const $listTransactions = createServerFn(
  "GET",
  async (input: z.input<typeof ListTransactionsInput>) => {
    try {
      const result = ListTransactionsInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const transactions = await findTransactionsPaginated(result.data);
      const transactionsCount = await findTransactionsCount({
        dateRange: result.data.dateRange,
        transactionType: result.data.transactionType,
        category: result.data.category,
        amount: result.data.amount,
      });

      return {
        data: transactions,
        totalTransactions: transactionsCount,
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
