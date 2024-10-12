import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import {
  PastureInsert,
  PastureRotationInsert,
  PastureUpdate,
  tablePasture,
  tablePastureRotation,
} from "@/server/db/schema";

export async function addPasture(data: { pasture: PastureInsert }) {
  try {
    // Insert the new pasture data into the tablePasture
    const [newPasture] = await db
      .insert(tablePasture)
      .values(data.pasture)
      .returning();

    // Return the newly created pasture
    return newPasture;
  } catch (error) {
    console.error("Error adding pasture:", error);
    throw new Error("Failed to add pasture");
  }
}

export async function deletePasture(pastureId: string) {
  try {
    const results = await db
      .delete(tablePasture)
      .where(eq(tablePasture.pastureId, pastureId))
      .returning();

    return results[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete pasture: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred while deleting pasture");
    }
  }
}

export async function startPastureRotation(
  pastureId: string,
  rotationData: Omit<PastureRotationInsert, "pastureRotationId">
) {
  const currentTime = Math.floor(Date.now() / 1000); // Assuming the timestamp is in seconds

  // Update the pasture's current status and occupancy
  await db
    .update(tablePasture)
    .set({
      currentStatus: "In Rotation",
      currentOccupancy:
        rotationData.newOccupancy ?? tablePasture.currentOccupancy, // Use existing value if not provided
      lastRotationDate: currentTime,
      nextRotationDate: currentTime + (rotationData.rotationDuration ?? 0), // Assuming rotationDuration is in seconds
    })
    .where(eq(tablePasture.pastureId, pastureId));

  // Insert a new pasture rotation record
  const newRotation: PastureRotationInsert = {
    pastureId,
    startDate: currentTime,
    endDate: currentTime + (rotationData.rotationDuration ?? 0), // Assuming rotationDuration is in seconds
    horses: rotationData.horses ?? [],
    notes: rotationData.notes,
    status: "Active",
    currentOccupancy: rotationData.newOccupancy ?? 0, // Default to 0 if not provided
    daysLeft: rotationData.rotationDuration
      ? Math.floor(rotationData.rotationDuration / 86400)
      : 0, // Convert seconds to days
  };

  await db.insert(tablePastureRotation).values(newRotation);
}

export async function updatePasture({
  pastureId,
  pasture,
}: {
  pastureId: string;
  pasture: PastureUpdate;
}) {
  try {
    const [updatedPasture] = await db
      .update(tablePasture)
      .set(pasture)
      .where(eq(tablePasture.pastureId, pastureId))
      .returning();

    return updatedPasture;
  } catch (error) {
    console.error("Error updating pasture:", error);
    throw new Error("Failed to update pasture");
  }
}
