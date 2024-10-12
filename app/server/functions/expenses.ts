import { createServerFn } from '@tanstack/start';
import { z } from 'zod';
import { getExpenseById, findExpenses, findExpensesPaginated } from '@/server/db/queries/expense/read';

// Define the input schema
const GetExpenseByIdInput = z.object({
  expenseId: z.string().min(1, "Expense ID is required"),
});

export const $getExpenseById = createServerFn(
  "GET",
  async (input: z.input<typeof GetExpenseByIdInput>) => {
    try {
      const result = GetExpenseByIdInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const expense = await getExpenseById(result.data.expenseId);

      return {
        data: expense ?? null, // Return null if no expense is found
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
  },
);

// Define the input schema for listing expenses
const ListExpensesInput = z.object({
  month: z.number().optional(),
  year: z.number().optional(),
  dateRange: z.string().optional(),
  category: z.string().optional(),
  vendor: z.string().optional(),
});

export const $listExpenses = createServerFn(
  "GET",
  async (input: z.input<typeof ListExpensesInput>) => {
    try {
      const result = ListExpensesInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const expenses = await findExpenses(result.data);

      return {
        data: expenses ?? [],
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
  },
);

// Define the input schema for listing expenses
const ListExpensesInput = z.object({
  page: z.number().catch(1),
  pageSize: z.number().catch(10),
  dateRange: z.string().optional(),
  category: z.string().optional(),
  vendor: z.string().optional(),
});

export const $listExpensesPaginated = createServerFn(
  "GET",
  async (input: z.input<typeof ListExpensesInput>) => {
    try {
      const result = ListExpensesInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const expenses = await findExpensesPaginated(result.data);

      return {
        data: expenses ?? [],
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
  },
);