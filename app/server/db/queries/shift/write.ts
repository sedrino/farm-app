import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { ShiftInsert, ShiftUpdate, tableShift } from "@/server/db/schema";

export async function addShift(shiftData: ShiftInsert): Promise<ShiftInsert> {
  try {
    // Insert the new shift data into the tableShift
    const [newShift] = await db
      .insert(tableShift)
      .values(shiftData)
      .returning();

    // Return the newly created shift
    return newShift;
  } catch (error) {
    console.error("Error adding shift:", error);
    throw new Error("Failed to add shift");
  }
}

export async function assignShift(data: {
  staffId: string;
  date: number;
  startTime: number;
  endTime: number;
  position: string;
  assignedArea: string;
}): Promise<ShiftInsert> {
  try {
    // Insert the new shift into the tableShift
    const [newShift] = await db
      .insert(tableShift)
      .values({
        staffId: data.staffId,
        startTime: data.startTime,
        endTime: data.endTime,
        position: data.position,
        assignedArea: data.assignedArea,
        status: "scheduled", // Assuming the default status is "scheduled"
      })
      .returning();

    return newShift;
  } catch (error) {
    console.error("Error assigning shift:", error);
    throw new Error("Failed to assign shift");
  }
}

export async function deleteShift(shiftId: string) {
  try {
    const results = await db
      .delete(tableShift)
      .where(eq(tableShift.shiftId, shiftId))
      .returning();

    return results[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete shift: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred while deleting shift");
    }
  }
}

export async function updateShift({
  shiftId,
  shift,
}: {
  shiftId: string;
  shift: ShiftUpdate;
}): Promise<ShiftUpdate> {
  const [updatedShift] = await db
    .update(tableShift)
    .set(shift)
    .where(eq(tableShift.shiftId, shiftId))
    .returning();

  return updatedShift;
}
