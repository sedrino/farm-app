import { db } from "@/server/db/connection";
import {
  PastureRotationInsert,
  tablePastureRotation,
} from "@/server/db/schema";

export async function addPastureRotation(data: PastureRotationInsert) {
  try {
    // Insert the new pasture rotation data into the table
    const result = await db
      .insert(tablePastureRotation)
      .values(data)
      .returning();

    // Return the inserted pasture rotation
    return result[0];
  } catch (error) {
    console.error("Error adding pasture rotation:", error);
    throw new Error("Failed to add pasture rotation");
  }
}

export async function startNewRotation(data: {
  pastureId: string;
  startDate: string;
  endDate: string;
}): Promise<PastureRotationInsert> {
  const { pastureId, startDate, endDate } = data;

  // Insert a new pasture rotation record
  const [newRotation] = await db
    .insert(tablePastureRotation)
    .values({
      pastureId,
      startDate: new Date(startDate).getTime(), // Convert to timestamp
      endDate: new Date(endDate).getTime(), // Convert to timestamp
      horses: [], // Assuming no horses are assigned at the start
      status: "active", // Set initial status
    })
    .returning();

  return newRotation;
}
