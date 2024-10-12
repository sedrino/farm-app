import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  findBudgetsPaginated,
  getBudgetById,
} from "@/server/db/queries/budget/read";
import { updateBudget } from "@/server/db/queries/budget/write";

// Define the input schema
const GetBudgetByIdInput = z.object({
  budgetId: z.string().min(1, "Budget ID is required"),
});

export const $getBudgetById = createServerFn(
  "GET",
  async (input: z.input<typeof GetBudgetByIdInput>) => {
    try {
      const result = GetBudgetByIdInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const budget = await getBudgetById(result.data.budgetId);

      return {
        data: budget ?? null, // the result from the query function returns undefined if no data is found, we need to that to be translated to null
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

// Define the input schema
const ListBudgetsInput = z.object({
  page: z.number().min(1).catch(1),
  pageSize: z.number().min(1).catch(50),
  search: z.string().optional(),
  sort: z.enum(["name", "date"]).catch("name"),
});

export const $listBudgets = createServerFn(
  "GET",
  async (input: z.input<typeof ListBudgetsInput>) => {
    try {
      const result = ListBudgetsInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const budgets = await findBudgetsPaginated(result.data);

      return {
        data: budgets ?? [],
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

// Define the input schema
const UpdateBudgetInput = z.object({
  budgetId: z.string().min(1, "Budget ID is required"),
  budget: z.object({
    name: z.string().min(1, "Budget name is required"),
    amount: z.number().min(0, "Amount must be at least 0"),
    period: z.string().min(1, "Period is required"),
  }),
});

export const $updateBudget = createServerFn(
  "POST",
  async (input: z.input<typeof UpdateBudgetInput>) => {
    try {
      const result = UpdateBudgetInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const updatedBudget = await updateBudget(result.data);

      return {
        budget: updatedBudget,
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
