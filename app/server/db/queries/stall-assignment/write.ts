import { db } from "@/server/db/connection";
import {
  StallAssignmentInsert,
  tableStallAssignment,
} from "@/server/db/schema";

export async function assignHorseToStall(data: {
  stallId: string;
  horseId: string;
  startDate: string;
  expectedDuration: string;
  notes?: string;
}): Promise<StallAssignmentInsert> {
  const { stallId, horseId, startDate, expectedDuration, notes } = data;

  // Insert the stall assignment into the database
  const [newAssignment] = await db
    .insert(tableStallAssignment)
    .values({
      stallId,
      horseId,
      startDate: new Date(startDate).getTime(), // Convert to timestamp
      expectedDuration: parseInt(expectedDuration, 10), // Convert to integer
      notes,
    })
    .returning();

  return newAssignment;
}
