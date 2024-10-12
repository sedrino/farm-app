import { and, eq, sql } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableStaffSchedule } from "@/server/db/schema";

interface FindStaffSchedulesInput {
  page: number;
  pageSize: number;
  week?: string;
  role?: string;
}

export async function findStaffSchedules({
  page,
  pageSize,
  week,
  role,
}: FindStaffSchedulesInput) {
  const offset = (page - 1) * pageSize;

  const filters = [];
  if (week) {
    // Assuming week is a string like "2023-W40" (ISO week date)
    const [year, weekNumber] = week.split("-");

    // Calculate the start and end dates of the week
    const startDate = sql`${new Date(`${year}-W${weekNumber}-1`)}`;
    const endDate = sql`${new Date(`${year}-W${weekNumber}-7`)}`;

    filters.push(
      and(
        sql`${tableStaffSchedule.shiftStart} >= ${startDate}`,
        sql`${tableStaffSchedule.shiftEnd} <= ${endDate}`
      )
    );
  }

  if (role) {
    filters.push(eq(tableStaffSchedule.role, role));
  }

  const staffSchedules = await db.query.tableStaffSchedule.findMany({
    with: {
      user: true,
    },
    where: and(...filters),
    limit: pageSize,
    offset: offset,
  });

  return staffSchedules;
}

export async function getStaffSchedule(staffId: string) {
  try {
    const results = await db
      .select()
      .from(tableStaffSchedule)
      .where(eq(tableStaffSchedule.userId, staffId));

    return results[0] || null; // Return the first result or null if not found
  } catch (error) {
    console.error("Error fetching staff schedule:", error);
    throw new Error("Failed to fetch staff schedule");
  }
}
