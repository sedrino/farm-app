import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { HorseInsert, HorseUpdate, tableHorse } from "@/server/db/schema";

export async function addHorse(horseData: HorseInsert) {
  try {
    // Insert the horse data into the tableHorse
    const [newHorse] = await db
      .insert(tableHorse)
      .values(horseData)
      .returning();

    // Return the newly created horse
    return newHorse;
  } catch (error) {
    console.error("Error adding horse:", error);
    throw new Error("Failed to add horse");
  }
}

export async function deleteHorse(horseId: string) {
  try {
    const results = await db
      .delete(tableHorse)
      .where(eq(tableHorse.horseId, horseId))
      .returning();

    return results[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete horse: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred while deleting horse");
    }
  }
}

export async function updateHorse({
  horseId,
  horse,
}: {
  horseId: string;
  horse: HorseUpdate;
}) {
  try {
    const [updatedHorse] = await db
      .update(tableHorse)
      .set(horse)
      .where(eq(tableHorse.horseId, horseId))
      .returning();

    return updatedHorse;
  } catch (error) {
    console.error("Error updating horse:", error);
    throw new Error("Failed to update horse");
  }
}
