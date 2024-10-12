import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  addIncome,
  deleteIncome,
  updateIncome,
} from "@/server/db/queries/income/write";

// Define the input schema
const CreateIncomeInput = z.object({
  income: z.object({
    date: z.string().min(1, "Date is required"),
    amount: z.number().min(0, "Amount must be positive"),
    categoryId: z.string().min(1, "Category is required"),
    sourceId: z.string().min(1, "Source is required"),
    description: z.string().optional(),
    isRecurring: z.boolean().default(false),
    recurrenceFrequency: z.string().optional(),
  }),
  documents: z.array(z.string()).default([]).optional(),
});

export const $createIncome = createServerFn(
  "POST",
  async (input: z.input<typeof CreateIncomeInput>) => {
    try {
      const result = CreateIncomeInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const income = await addIncome(result.data.income);

      return {
        income,
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
const DeleteIncomeInput = z.object({
  incomeId: z.string().min(1, "Income ID is required"),
});

export const $deleteIncome = createServerFn(
  "POST",
  async (input: z.input<typeof DeleteIncomeInput>) => {
    try {
      const result = DeleteIncomeInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      await deleteIncome(result.data.incomeId);

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
const UpdateIncomeInput = z.object({
  incomeId: z.string().min(1, "Income ID is required"),
  income: z.object({
    amount: z.number().min(0, "Amount must be at least 0"),
    date: z.string().min(1, "Date is required"),
    category: z.string().min(1, "Category is required"),
    source: z.string().min(1, "Source is required"),
    description: z.string().optional(),
    paymentMethod: z.string().min(1, "Payment method is required"),
  }),
});

export const $updateIncome = createServerFn(
  "POST",
  async (input: z.input<typeof UpdateIncomeInput>) => {
    try {
      const result = UpdateIncomeInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const updatedIncome = await updateIncome(result.data);

      return {
        income: updatedIncome,
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
