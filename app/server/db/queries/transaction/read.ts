import { and, eq, sql } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableTransaction } from "@/server/db/schema";

interface TransactionCountFilters {
  dateRange?: string;
  transactionType?: "income" | "expense";
  category?: string;
  amount?: number;
}

export async function findTransactionsCount(
  filters: TransactionCountFilters
): Promise<number> {
  const { dateRange, transactionType, category, amount } = filters;

  const conditions = [];

  if (dateRange) {
    const [startDate, endDate] = dateRange.split(",");
    conditions.push(
      sql`${tableTransaction.date} BETWEEN ${new Date(startDate).getTime()} AND ${new Date(endDate).getTime()}`
    );
  }

  if (transactionType) {
    conditions.push(eq(tableTransaction.type, transactionType));
  }

  if (category) {
    conditions.push(eq(tableTransaction.category, category));
  }

  if (amount) {
    conditions.push(eq(tableTransaction.amount, amount));
  }

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(tableTransaction)
    .where(and(...conditions))
    .get();

  return result?.count || 0;
}

interface FindTransactionsPaginatedInput {
  page: number;
  pageSize: number;
  dateRange?: string;
  transactionType?: "income" | "expense";
  category?: string;
  amount?: number;
}

export async function findTransactionsPaginated({
  page,
  pageSize,
  dateRange,
  transactionType,
  category,
  amount,
}: FindTransactionsPaginatedInput) {
  const offset = (page - 1) * pageSize;

  const filters = [];

  if (dateRange) {
    const [startDate, endDate] = dateRange.split(",");
    filters.push(
      sql`${tableTransaction.date} BETWEEN ${new Date(startDate).getTime()} AND ${new Date(endDate).getTime()}`
    );
  }

  if (transactionType) {
    filters.push(eq(tableTransaction.type, transactionType));
  }

  if (category) {
    filters.push(eq(tableTransaction.category, category));
  }

  if (amount) {
    filters.push(eq(tableTransaction.amount, amount));
  }

  const transactions = await db.query.tableTransaction.findMany({
    with: {
      user: true,
    },
    where: and(...filters),
    limit: pageSize,
    offset: offset,
  });

  return transactions;
}
