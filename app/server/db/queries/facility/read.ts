import { eq, like } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableFacility } from "@/server/db/schema";

export async function findFacilities({
  page = 1,
  pageSize = 10,
  search = "",
  sort = "name",
}: {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: "name" | "type" | "capacity";
}) {
  const offset = (page - 1) * pageSize;

  const query = db
    .select()
    .from(tableFacility)
    .where(search ? like(tableFacility.name, `%${search}%`) : undefined)
    .orderBy(sort === "name" ? tableFacility.name : undefined)
    .limit(pageSize)
    .offset(offset);

  const facilities = await query;

  return facilities;
}

export async function getFacilityById(facilityId: string) {
  const results = await db
    .select()
    .from(tableFacility)
    .where(eq(tableFacility.facilityId, facilityId));

  return results[0] || null; // Return the first result or null if not found
}
