import { and, eq, sql } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableIncome } from "@/server/db/schema";

interface FindIncomesInput {
  month?: number;
  year?: number;
  dateRange?: string;
  category?: string;
  source?: string;
}

export async function findIncomes(input: FindIncomesInput) {
  const { month, year, dateRange, category, source } = input;

  const filters = [];

  if (month) {
    filters.push(sql`${tableIncome.date} % 12 = ${month}`);
  }

  if (year) {
    filters.push(sql`${tableIncome.date} / 10000 = ${year}`);
  }

  if (dateRange) {
    const [startDate, endDate] = dateRange.split(",");
    filters.push(
      sql`${tableIncome.date} BETWEEN ${new Date(startDate).getTime()} AND ${new Date(endDate).getTime()}`
    );
  }

  if (category) {
    filters.push(eq(tableIncome.category, category));
  }

  if (source) {
    filters.push(eq(tableIncome.source, source));
  }

  const incomes = await db.query.tableIncome.findMany({
    where: and(...filters),
  });

  return incomes;
}

interface FindIncomesPaginatedInput {
  page: number;
  pageSize: number;
  dateRange?: string;
  category?: string;
  source?: string;
}

export async function findIncomesPaginated({
  page,
  pageSize,
  dateRange,
  category,
  source,
}: FindIncomesPaginatedInput) {
  const offset = (page - 1) * pageSize;

  const filters = [];

  if (dateRange) {
    const [startDate, endDate] = dateRange.split(",");
    filters.push(
      sql`${tableIncome.date} BETWEEN ${new Date(startDate).getTime()} AND ${new Date(endDate).getTime()}`
    );
  }

  if (category) {
    filters.push(eq(tableIncome.category, category));
  }

  if (source) {
    filters.push(eq(tableIncome.source, source));
  }

  const incomes = await db.query.tableIncome.findMany({
    with: {
      user: true,
    },
    where: and(...filters),
    limit: pageSize,
    offset: offset,
  });

  return incomes;
}

export async function getIncomeById(incomeId: string) {
  const results = await db
    .select()
    .from(tableIncome)
    .where(eq(tableIncome.incomeId, incomeId));

  return results[0] || null; // Return the first result or null if not found
}
