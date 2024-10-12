import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableIncomeCategory } from "@/server/db/schema";

export async function findIncomeCategories() {
  try {
    const incomeCategories = await db
      .select()
      .from(tableIncomeCategory)
      .where(eq(tableIncomeCategory.deletedAt, null)); // Assuming you want to exclude soft-deleted categories

    return incomeCategories;
  } catch (error) {
    console.error("Error fetching income categories:", error);
    throw new Error("Failed to fetch income categories");
  }
}
