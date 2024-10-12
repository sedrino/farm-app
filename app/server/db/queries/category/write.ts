import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableExpenseCategory, tableIncomeCategory } from "@/server/db/schema";

export async function deleteCategory(categoryId: string) {
  try {
    // First, delete from the expense category table
    const deletedExpenseCategory = await db
      .delete(tableExpenseCategory)
      .where(eq(tableExpenseCategory.expenseCategoryId, categoryId))
      .returning();

    // Then, delete from the income category table
    const deletedIncomeCategory = await db
      .delete(tableIncomeCategory)
      .where(eq(tableIncomeCategory.incomeCategoryId, categoryId))
      .returning();

    // Return the results
    return {
      success: true,
      deletedExpenseCategory,
      deletedIncomeCategory,
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
