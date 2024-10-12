import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { FacilityInsert, tableFacility } from "@/server/db/schema";

export async function addFacility(data: FacilityInsert) {
  try {
    // Insert the new facility data into the tableFacility
    const [newFacility] = await db
      .insert(tableFacility)
      .values(data)
      .returning();

    // Return the newly created facility
    return newFacility;
  } catch (error) {
    console.error("Error adding facility:", error);
    throw new Error("Failed to add facility");
  }
}

export async function deleteFacility(facilityId: string) {
  try {
    const results = await db
      .delete(tableFacility)
      .where(eq(tableFacility.facilityId, facilityId))
      .returning();

    return results[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete facility: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred while deleting facility");
    }
  }
}
