import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { StaffInsert, StaffUpdate, tableStaff } from "@/server/db/schema";

export async function addStaff(staffData: StaffInsert): Promise<StaffInsert> {
  try {
    // Insert the new staff member into the tableStaff
    const [newStaff] = await db
      .insert(tableStaff)
      .values(staffData)
      .returning();

    // Return the newly created staff member
    return newStaff;
  } catch (error) {
    console.error("Error adding staff:", error);
    throw new Error("Failed to add staff member");
  }
}

export async function deleteStaff(staffId: string) {
  try {
    const results = await db
      .delete(tableStaff)
      .where(eq(tableStaff.staffId, staffId))
      .returning();

    return results[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete staff: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred while deleting staff");
    }
  }
}

export async function updateStaff({
  staffId,
  staff,
}: {
  staffId: string;
  staff: StaffUpdate;
}) {
  try {
    const [updatedStaff] = await db
      .update(tableStaff)
      .set(staff)
      .where(eq(tableStaff.staffId, staffId))
      .returning();

    return updatedStaff;
  } catch (error) {
    console.error("Error updating staff:", error);
    throw new Error("Failed to update staff");
  }
}
