import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { ExpenseInsert, ExpenseUpdate, tableExpense } from "@/server/db/schema";

export async function addExpense(data: ExpenseInsert): Promise<ExpenseInsert> {
  try {
    // Insert the new expense into the tableExpense
    const [newExpense] = await db.insert(tableExpense).values(data).returning();

    // Return the newly created expense
    return newExpense;
  } catch (error) {
    console.error("Error adding expense:", error);
    throw new Error("Failed to add expense");
  }
}

export async function deleteExpense(expenseId: string) {
  try {
    const results = await db
      .delete(tableExpense)
      .where(eq(tableExpense.expenseId, expenseId))
      .returning();

    return results[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete expense: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred while deleting expense");
    }
  }
}

export async function updateExpense({
  expenseId,
  expense,
}: {
  expenseId: string;
  expense: ExpenseUpdate;
  tags?: string[];
}) {
  try {
    // Update the expense in the database
    const [updatedExpense] = await db
      .update(tableExpense)
      .set(expense)
      .where(eq(tableExpense.expenseId, expenseId))
      .returning();

    // If there are tags, you might want to handle them here
    // For example, updating a tags table or similar

    return updatedExpense;
  } catch (error) {
    console.error("Error updating expense:", error);
    throw new Error("Failed to update expense");
  }
}
