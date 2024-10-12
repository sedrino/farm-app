import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  findIncomes,
  findIncomesPaginated,
  getIncomeById,
} from "@/server/db/queries/income/read";

// Define the input schema
const GetIncomeByIdInput = z.object({
  incomeId: z.string().min(1, "Income ID is required"),
});

export const $getIncomeById = createServerFn(
  "GET",
  async (input: z.input<typeof GetIncomeByIdInput>) => {
    try {
      const result = GetIncomeByIdInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const income = await getIncomeById(result.data.incomeId);

      return {
        data: income ?? null, // Return null if no income is found
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

// Define the input schema for listing incomes
const ListIncomesInput = z.object({
  month: z.number().optional(),
  year: z.number().optional(),
  dateRange: z.string().optional(),
  category: z.string().optional(),
  source: z.string().optional(),
});

export const $listIncomes = createServerFn(
  "GET",
  async (input: z.input<typeof ListIncomesInput>) => {
    try {
      const result = ListIncomesInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const incomes = await findIncomes(result.data);

      return {
        data: incomes ?? [],
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

// Define the input schema for listing incomes
const ListIncomesPaginatedInput = z.object({
  page: z.number().catch(1),
  pageSize: z.number().catch(10),
  dateRange: z.string().optional(),
  category: z.string().optional(),
  source: z.string().optional(),
});

export const $listIncomesPaginated = createServerFn(
  "GET",
  async (input: z.input<typeof ListIncomesPaginatedInput>) => {
    try {
      const result = ListIncomesPaginatedInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const incomes = await findIncomesPaginated(result.data);

      return {
        data: incomes ?? [],
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
