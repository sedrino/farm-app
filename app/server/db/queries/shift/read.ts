import { and, desc, eq, sql } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableShift } from "@/server/db/schema";

interface FindShiftsPaginatedInput {
  page: number;
  pageSize: number;
  search?: string;
  sort: "date" | "staff" | "role";
}

export async function findShiftsPaginated({
  page,
  pageSize,
  search,
  sort,
}: FindShiftsPaginatedInput) {
  const offset = (page - 1) * pageSize;

  // Determine the sorting column
  let orderByColumn;
  switch (sort) {
    case "date":
      orderByColumn = tableShift.startTime;
      break;
    case "staff":
      orderByColumn = tableShift.staffId;
      break;
    case "role":
      orderByColumn = tableShift.position;
      break;
    default:
      orderByColumn = tableShift.startTime;
  }

  // Build the query
  const query = db
    .select()
    .from(tableShift)
    .where(
      and(
        search ? sql`${tableShift.position} LIKE ${`%${search}%`}` : undefined
      )
    )
    .orderBy(desc(orderByColumn))
    .limit(pageSize)
    .offset(offset);

  const results = await query;

  return results;
}

export async function getShiftById(shiftId: string) {
  const results = await db
    .select()
    .from(tableShift)
    .where(eq(tableShift.shiftId, shiftId));

  return results[0] || null; // Return the first result or null if not found
}
