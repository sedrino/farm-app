import { and, eq, ilike, sql } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableStall, tableStallOccupancy } from "@/server/db/schema";

interface FindStallsInput {
  page: number;
  pageSize: number;
  search?: string;
  sort: "stallNumber" | "lastMaintenanceDate";
}

export async function findStalls(input: FindStallsInput) {
  const { page, pageSize, search, sort } = input;

  // Base query
  const query = db.query.tableStall.findMany({
    with: {
      horse: true,
    },
    where: and(search ? ilike(tableStall.number, `%${search}%`) : undefined),
    limit: pageSize,
    offset: (page - 1) * pageSize,
    orderBy:
      sort === "stallNumber"
        ? eq(tableStall.number, tableStall.number)
        : eq(tableStall.lastMaintenanceDate, tableStall.lastMaintenanceDate),
  });

  const stalls = await query;

  return stalls;
}

export async function findStallsOccupancy(dateRange: string) {
  // Define the date range for the query
  const [startDate, endDate] = parseDateRange(dateRange);

  // Query to find stall occupancy within the specified date range
  const occupancyData = await db
    .select({
      stallId: tableStall.stallId,
      stallNumber: tableStall.number,
      horseId: tableStallOccupancy.horseId,
      occupancyStatus:
        sql`CASE WHEN ${tableStallOccupancy.startDate} <= ${startDate} AND ${tableStallOccupancy.endDate} >= ${endDate} THEN 'Occupied' ELSE 'Available' END`.as(
          "occupancy_status"
        ),
    })
    .from(tableStall)
    .leftJoin(
      tableStallOccupancy,
      eq(tableStall.stallId, tableStallOccupancy.stallId)
    )
    .where(
      and(
        sql`${tableStallOccupancy.startDate} <= ${endDate}`,
        sql`${tableStallOccupancy.endDate} >= ${startDate}`
      )
    )
    .all();

  return occupancyData;
}

// Helper function to parse the date range
function parseDateRange(dateRange: string): [number, number] {
  // Assuming the date range is in the format "YYYY-MM-DD to YYYY-MM-DD"
  const [start, end] = dateRange.split(" to ");
  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();

  return [startDate, endDate];
}

export async function getStallById(stallId: string) {
  const results = await db
    .select()
    .from(tableStall)
    .where(eq(tableStall.stallId, stallId));

  return results[0] || null; // Return the first result or null if not found
}

export async function getStallsMap(barnId: string) {
  try {
    const stalls = await db
      .select()
      .from(tableStall)
      .where(eq(tableStall.barnId, barnId));

    return stalls;
  } catch (error) {
    console.error("Error fetching stalls map:", error);
    throw new Error("Failed to fetch stalls map");
  }
}
