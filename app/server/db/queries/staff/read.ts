import { and, desc, eq, sql } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableStaff, tableStaffRole } from "@/server/db/schema";

interface FindStaffPaginatedInput {
  page: number;
  pageSize: number;
  search?: string;
  sort: "name" | "role" | "status";
}

export async function findStaffPaginated({
  page,
  pageSize,
  search,
  sort,
}: FindStaffPaginatedInput) {
  const offset = (page - 1) * pageSize;

  const orderBy =
    sort === "name"
      ? asc(tableStaff.username)
      : sort === "role"
        ? asc(tableStaff.role)
        : asc(tableStaff.status);

  const filters = [];
  if (search) {
    filters.push(sql`${tableStaff.username} LIKE ${`%${search}%`}`);
  }

  const query = db
    .select()
    .from(tableStaff)
    .where(and(...filters))
    .orderBy(orderBy)
    .limit(pageSize)
    .offset(offset);

  const results = await query;

  return results;
}

export async function findStaffRoles({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) {
  const offset = (page - 1) * pageSize;

  const staffRoles = await db
    .select()
    .from(tableStaffRole)
    .limit(pageSize)
    .offset(offset);

  return staffRoles;
}

export async function getStaffById(staffId: string) {
  const results = await db
    .select()
    .from(tableStaff)
    .where(eq(tableStaff.staffId, staffId));

  return results[0] || null; // Return the first result or null if not found
}
