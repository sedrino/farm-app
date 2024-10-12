import { and, desc, eq, sql } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableBudget, tableExpenseCategory } from "@/server/db/schema";

export async function getExpenseCategories(budgetId: string) {
  try {
    const categories = await db
      .select()
      .from(tableExpenseCategory)
      .where(eq(tableExpenseCategory.budgetId, budgetId));

    return categories;
  } catch (error) {
    console.error("Error fetching expense categories:", error);
    throw new Error("Failed to fetch expense categories");
  }
}

interface FindBudgetsPaginatedInput {
  page: number;
  pageSize: number;
  search?: string;
  sort?: "name" | "date";
}

export async function findBudgetsPaginated({
  page,
  pageSize,
  search,
  sort = "name",
}: FindBudgetsPaginatedInput) {
  const offset = (page - 1) * pageSize;

  const result = await db.query.tableBudget.findMany({
    with: {
      user: true,
      budgetCategories: true,
    },
    where: and(
      search ? sql`${tableBudget.name} LIKE ${`%${search}%`}` : undefined
    ),
    limit: pageSize,
    offset: offset,
    orderBy: sort === "name" ? asc(tableBudget.name) : desc(tableBudget.year),
  });

  return result;
}

export async function getBudgetById(budgetId: string) {
  const results = await db
    .select()
    .from(tableBudget)
    .where(eq(tableBudget.budgetId, budgetId));

  return results[0] || null; // Return the first result or null if not found
}
