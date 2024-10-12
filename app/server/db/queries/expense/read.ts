import { and, eq, sql } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableExpense } from "@/server/db/schema";

export async function getExpenseById(expenseId: string) {
  const results = await db
    .select()
    .from(tableExpense)
    .where(eq(tableExpense.expenseId, expenseId));

  return results[0] || null; // Return the first result or null if not found
}

interface FindExpensesInput {
  month?: number;
  year?: number;
  dateRange?: string;
  category?: string;
  vendor?: string;
}

export async function findExpenses(input: FindExpensesInput) {
  const { month, year, dateRange, category, vendor } = input;

  const filters = [];

  if (month) {
    filters.push(
      sql`${tableExpense.date} BETWEEN ${new Date(year, month - 1, 1).getTime()} AND ${new Date(year, month, 1).getTime()}`
    );
  }

  if (year) {
    filters.push(eq(sql`strftime('%Y', ${tableExpense.date})`, year));
  }

  if (dateRange) {
    const [startDate, endDate] = dateRange.split(" to ");
    filters.push(
      sql`${tableExpense.date} BETWEEN ${new Date(startDate).getTime()} AND ${new Date(endDate).getTime()}`
    );
  }

  if (category) {
    filters.push(eq(tableExpense.category, category));
  }

  if (vendor) {
    filters.push(eq(tableExpense.vendor, vendor));
  }

  const expenses = await db.query.tableExpense.findMany({
    where: and(...filters),
  });

  return expenses;
}

interface FindExpensesPaginatedInput {
  page: number;
  pageSize: number;
  dateRange?: string;
  category?: string;
  vendor?: string;
}

export async function findExpensesPaginated({
  page,
  pageSize,
  dateRange,
  category,
  vendor,
}: FindExpensesPaginatedInput) {
  const offset = (page - 1) * pageSize;

  const filters = [];

  if (dateRange) {
    const [startDate, endDate] = dateRange.split(",");
    filters.push(
      sql`${tableExpense.date} BETWEEN ${new Date(startDate).getTime()} AND ${new Date(endDate).getTime()}`
    );
  }

  if (category) {
    filters.push(eq(tableExpense.category, category));
  }

  if (vendor) {
    filters.push(eq(tableExpense.vendor, vendor));
  }

  const expenses = await db.query.tableExpense.findMany({
    with: {
      user: true,
    },
    where: and(...filters),
    limit: pageSize,
    offset: offset,
  });

  return expenses;
}
