import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableExpenseCategory } from "@/server/db/schema";

export async function findExpenseCategories() {
  try {
    const expenseCategories = await db
      .select()
      .from(tableExpenseCategory)
      .where(eq(tableExpenseCategory.deletedAt, null));

    return expenseCategories;
  } catch (error) {
    console.error("Error fetching expense categories:", error);
    throw new Error("Failed to fetch expense categories");
  }
}
