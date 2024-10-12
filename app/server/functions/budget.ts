import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { getExpenseCategories } from "@/server/db/queries/budget/read";
import {
  addBudget,
  deleteBudget,
  updateBudget,
} from "@/server/db/queries/budget/write";

// Define the input schema
const CreateBudgetInput = z.object({
  budget: z.object({
    year: z.number().min(2023, "Year must be 2023 or later"),
    totalAmount: z.number().min(0, "Total amount must be at least 0"),
    status: z.enum(["draft", "approved", "finalized"]).default("draft"),
    isTemplate: z.boolean().default(false),
    name: z.string().min(1, "Name is required"),
  }),
  allocations: z.array(
    z.object({
      categoryId: z.string(),
      amount: z.number().min(0, "Amount must be at least 0"),
      monthlyAllocations: z
        .array(
          z.object({
            month: z.string(),
            amount: z.number().min(0, "Monthly amount must be at least 0"),
          })
        )
        .min(1, "At least one monthly allocation is required"),
    })
  ),
});

export const $createBudget = createServerFn(
  "POST",
  async (input: z.input<typeof CreateBudgetInput>) => {
    try {
      const result = CreateBudgetInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const budget = await addBudget(result.data);

      return {
        budget,
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
const DeleteBudgetInput = z.object({
  budgetId: z.string().min(1, "Budget ID is required"),
});

export const $deleteBudget = createServerFn(
  "POST",
  async (input: z.input<typeof DeleteBudgetInput>) => {
    try {
      const result = DeleteBudgetInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      await deleteBudget(result.data.budgetId);

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

// Define the input schema
const GetExpenseCategoriesInput = z.object({
  budgetId: z.string().min(1, "Budget ID is required"),
});

export const $getExpenseCategories = createServerFn(
  "GET",
  async (input: z.input<typeof GetExpenseCategoriesInput>) => {
    try {
      const result = GetExpenseCategoriesInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const expenseCategories = await getExpenseCategories(
        result.data.budgetId
      );

      return {
        data: expenseCategories ?? [], // Return an empty array if no categories are found
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
    year: z.number().min(2020, "Year must be 2020 or later"),
    totalAmount: z.number().min(0, "Total amount must be at least 0"),
    status: z.enum(["draft", "approved", "finalized"]).default("draft"),
    isTemplate: z.boolean().default(false),
    name: z.string().min(1, "Name is required"),
  }),
  categories: z
    .array(
      z.object({
        categoryId: z.string().min(1, "Category is required"),
        plannedAmount: z.number().min(0, "Planned amount must be at least 0"),
        actualAmount: z.number().min(0, "Actual amount must be at least 0"),
      })
    )
    .min(1, "At least one category is required"),
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
