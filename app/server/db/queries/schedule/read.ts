import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableSchedule } from "@/server/db/schema";

export async function getScheduleById(scheduleId: string) {
  const results = await db
    .select()
    .from(tableSchedule)
    .where(eq(tableSchedule.scheduleId, scheduleId));

  return results[0] || null; // Return the first result or null if not found
}
