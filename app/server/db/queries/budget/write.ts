import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { BudgetInsert, BudgetUpdate, tableBudget } from "@/server/db/schema";

export async function addBudget(budgetData: BudgetInsert) {
  try {
    // Insert the new budget into the tableBudget
    const [newBudget] = await db
      .insert(tableBudget)
      .values(budgetData)
      .returning();

    // Return the newly created budget
    return newBudget;
  } catch (error) {
    console.error("Error adding budget:", error);
    throw new Error("Failed to add budget");
  }
}

export async function deleteBudget(budgetId: string) {
  try {
    const results = await db
      .delete(tableBudget)
      .where(eq(tableBudget.budgetId, budgetId))
      .returning();

    return results[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete budget: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred while deleting budget");
    }
  }
}

export async function updateBudget({
  budgetId,
  budget,
  categories,
}: {
  budgetId: string;
  budget: BudgetUpdate;
  categories: { categoryId: string; plannedAmount: number }[];
}) {
  // Update the budget details
  const [updatedBudget] = await db
    .update(tableBudget)
    .set({
      year: budget.year,
      totalAmount: budget.totalAmount,
      status: budget.status,
      name: budget.name,
    })
    .where(eq(tableBudget.budgetId, budgetId))
    .returning();

  // Update the budget categories
  // Assuming you have a separate table for budget categories
  // You may need to adjust this part based on your actual schema
  for (const category of categories) {
    await db
      .update(tableBudgetCategory)
      .set({
        plannedAmount: category.plannedAmount,
      })
      .where(eq(tableBudgetCategory.budgetCategoryId, category.categoryId));
  }

  return updatedBudget;
}
