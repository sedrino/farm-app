import { and, eq, sql } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tablePayment } from "@/server/db/schema";

interface FindPaymentsInput {
  page: number;
  pageSize: number;
  dateRange?: string;
  boarderId?: string;
  paymentMethod?: string;
}

export async function findPayments(input: FindPaymentsInput) {
  const { page, pageSize, dateRange, boarderId, paymentMethod } = input;

  // Build the filters
  const filters = [];

  if (dateRange) {
    const [startDate, endDate] = dateRange.split(",");
    filters.push(
      sql`${tablePayment.paymentDate} BETWEEN ${new Date(startDate).getTime()} AND ${new Date(endDate).getTime()}`
    );
  }

  if (boarderId) {
    filters.push(eq(tablePayment.boarderId, boarderId));
  }

  if (paymentMethod) {
    filters.push(eq(tablePayment.paymentMethod, paymentMethod));
  }

  // Execute the query
  const payments = await db.query.tablePayment.findMany({
    with: {
      boarder: true,
    },
    where: and(...filters),
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  return payments;
}
