import { and, eq, sql } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableInvoice } from "@/server/db/schema";

interface FindInvoicesPaginatedInput {
  page: number;
  pageSize: number;
  dateRange?: string;
  boarderId?: string;
  status?: "paid" | "unpaid" | "overdue";
}

export async function findInvoicesPaginated({
  page,
  pageSize,
  dateRange,
  boarderId,
  status,
}: FindInvoicesPaginatedInput) {
  const offset = (page - 1) * pageSize;

  const filters = [];

  if (dateRange) {
    const [startDate, endDate] = dateRange.split(",");
    filters.push(
      sql`${tableInvoice.invoiceDate} BETWEEN ${new Date(startDate).getTime()} AND ${new Date(endDate).getTime()}`
    );
  }

  if (boarderId) {
    filters.push(eq(tableInvoice.boarderId, boarderId));
  }

  if (status) {
    filters.push(eq(tableInvoice.status, status));
  }

  const invoices = await db.query.tableInvoice.findMany({
    with: {
      boarder: true,
    },
    where: and(...filters),
    limit: pageSize,
    offset: offset,
  });

  return invoices;
}

export async function getInvoiceById(invoiceId: string) {
  const results = await db
    .select()
    .from(tableInvoice)
    .where(eq(tableInvoice.invoiceId, invoiceId));

  return results[0] || null; // Return the first result or null if not found
}
