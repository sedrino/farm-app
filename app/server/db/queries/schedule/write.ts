import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import {
  ScheduleInsert,
  ScheduleUpdate,
  tableSchedule,
} from "@/server/db/schema";

export async function addSchedule(data: ScheduleInsert) {
  try {
    // Insert the new schedule into the tableSchedule
    const [newSchedule] = await db
      .insert(tableSchedule)
      .values({
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
      })
      .returning();

    return newSchedule;
  } catch (error) {
    console.error("Error adding schedule:", error);
    throw new Error("Failed to add schedule");
  }
}

export async function editSchedule({
  scheduleId,
  schedule,
}: {
  scheduleId: string;
  schedule: ScheduleUpdate;
}) {
  try {
    const [updatedSchedule] = await db
      .update(tableSchedule)
      .set(schedule)
      .where(eq(tableSchedule.scheduleId, scheduleId))
      .returning();

    return updatedSchedule;
  } catch (error) {
    console.error("Error editing schedule:", error);
    throw new Error("Failed to edit schedule");
  }
}

export async function updateSchedule(data: {
  scheduleId: string;
  schedule: ScheduleUpdate;
  shifts: {
    staffId: string;
    startTime: number;
    endTime: number;
  }[];
}) {
  const { scheduleId, schedule, shifts } = data;

  // Update the schedule details
  await db
    .update(tableSchedule)
    .set({
      name: schedule.name,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      status: schedule.status,
    })
    .where(eq(tableSchedule.scheduleId, scheduleId));

  // Update the shifts (assuming you have a table for shifts)
  // This part is not fully implemented as it depends on your specific requirements and schema
  // You might need to insert new shifts, update existing ones, or delete old ones

  return {
    scheduleId,
    ...schedule,
  };
}
