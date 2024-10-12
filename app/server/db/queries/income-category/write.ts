import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableIncomeCategory } from "@/server/db/schema";

export async function deleteIncomeCategory(categoryId: string) {
  try {
    const results = await db
      .delete(tableIncomeCategory)
      .where(eq(tableIncomeCategory.incomeCategoryId, categoryId))
      .returning();

    return results[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete income category: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred while deleting income category");
    }
  }
}
