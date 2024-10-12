import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import {
  FeedingScheduleInsert,
  tableFeedingSchedule,
} from "@/server/db/schema";

export async function addFeedingSchedule(data: FeedingScheduleInsert) {
  try {
    // Insert the new feeding schedule into the tableFeedingSchedule
    const result = await db
      .insert(tableFeedingSchedule)
      .values(data)
      .returning();

    // Return the inserted feeding schedule
    return result[0];
  } catch (error) {
    console.error("Error adding feeding schedule:", error);
    throw new Error("Failed to add feeding schedule");
  }
}

export async function deleteFeedingSchedule(scheduleId: string) {
  try {
    const results = await db
      .delete(tableFeedingSchedule)
      .where(eq(tableFeedingSchedule.feedingScheduleId, scheduleId))
      .returning();

    return results[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete feeding schedule: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred while deleting feeding schedule");
    }
  }
}
