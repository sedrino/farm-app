import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  addExpense,
  deleteExpense,
  updateExpense,
} from "@/server/db/queries/expense/write";

// Define the input schema
const CreateExpenseInput = z.object({
  expense: z.object({
    date: z.string().min(1, "Date is required"),
    amount: z.number().min(0, "Amount must be a positive number"),
    category: z.string().min(1, "Category is required"),
    vendor: z.string().min(1, "Vendor/Payee is required"),
    description: z.string().optional(),
    paymentMethod: z.string().min(1, "Payment method is required"),
  }),
  receipt: z.instanceof(File).optional(),
});

export const $createExpense = createServerFn(
  "POST",
  async (input: z.input<typeof CreateExpenseInput>) => {
    try {
      const result = CreateExpenseInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const expense = await addExpense(result.data);

      return {
        expense,
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
const DeleteExpenseInput = z.object({
  expenseId: z.string().min(1, "Expense ID is required"),
});

export const $deleteExpense = createServerFn(
  "POST",
  async (input: z.input<typeof DeleteExpenseInput>) => {
    try {
      const result = DeleteExpenseInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      await deleteExpense(result.data.expenseId);

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
const UpdateExpenseInput = z.object({
  expenseId: z.string().min(1, "Expense ID is required"),
  expense: z.object({
    date: z.number().min(1, "Date is required"),
    amount: z.number().min(1, "Amount is required"),
    category: z.string().min(1, "Category is required"),
    vendor: z.string().min(1, "Vendor/Payee is required"),
    description: z.string().optional(),
    paymentMethod: z.string().min(1, "Payment method is required"),
  }),
  tags: z.array(z.string()).default([]).optional(),
});

export const $updateExpense = createServerFn(
  "POST",
  async (input: z.input<typeof UpdateExpenseInput>) => {
    try {
      const result = UpdateExpenseInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const updatedExpense = await updateExpense(result.data);

      return {
        expense: updatedExpense,
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
