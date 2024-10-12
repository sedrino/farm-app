import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { IncomeInsert, IncomeUpdate, tableIncome } from "@/server/db/schema";

export async function addIncome(data: IncomeInsert): Promise<IncomeInsert> {
  try {
    // Insert the income data into the tableIncome
    const [newIncome] = await db.insert(tableIncome).values(data).returning();

    // Return the newly created income entry
    return newIncome;
  } catch (error) {
    console.error("Error adding income:", error);
    throw new Error("Failed to add income");
  }
}

export async function deleteIncome(incomeId: string) {
  try {
    const results = await db
      .delete(tableIncome)
      .where(eq(tableIncome.incomeId, incomeId))
      .returning();

    return results[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete income: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred while deleting income");
    }
  }
}

export async function updateIncome({
  incomeId,
  income,
}: {
  incomeId: string;
  income: IncomeUpdate;
}) {
  try {
    const [updatedIncome] = await db
      .update(tableIncome)
      .set(income)
      .where(eq(tableIncome.incomeId, incomeId))
      .returning();

    return updatedIncome;
  } catch (error) {
    console.error("Error updating income:", error);
    throw new Error("Failed to update income");
  }
}
