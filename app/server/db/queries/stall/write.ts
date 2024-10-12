import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { StallInsert, StallUpdate, tableStall } from "@/server/db/schema";

export async function addStall(data: StallInsert): Promise<StallInsert> {
  try {
    // Insert the new stall data into the tableStall
    const [newStall] = await db.insert(tableStall).values(data).returning();

    // Return the newly created stall
    return newStall;
  } catch (error) {
    console.error("Error adding stall:", error);
    throw new Error("Failed to add stall");
  }
}

export async function deleteStall(stallId: string) {
  try {
    const results = await db
      .delete(tableStall)
      .where(eq(tableStall.stallId, stallId))
      .returning();

    return results[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete stall: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred while deleting stall");
    }
  }
}

export async function updateStall({
  stallId,
  stallData,
}: {
  stallId: string;
  stallData: StallUpdate;
}) {
  try {
    const updatedStalls = await db
      .update(tableStall)
      .set(stallData)
      .where(eq(tableStall.stallId, stallId))
      .returning();

    return updatedStalls[0];
  } catch (error) {
    console.error("Error updating stall:", error);
    throw new Error("Failed to update stall");
  }
}
