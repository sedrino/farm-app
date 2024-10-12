import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableBudgetCategory } from "@/server/db/schema";

export async function findBudgetCategories() {
  try {
    const budgetCategories = await db.select().from(tableBudgetCategory).all();

    return budgetCategories;
  } catch (error) {
    console.error("Error fetching budget categories:", error);
    throw new Error("Failed to fetch budget categories");
  }
}
