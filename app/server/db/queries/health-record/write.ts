import { db } from "@/server/db/connection";
import { HealthRecordInsert, tableHealthRecord } from "@/server/db/schema";

export async function addHealthRecord(data: HealthRecordInsert) {
  try {
    // Insert the health record into the tableHealthRecord
    const [newHealthRecord] = await db
      .insert(tableHealthRecord)
      .values(data)
      .returning();

    // Return the newly created health record
    return newHealthRecord;
  } catch (error) {
    console.error("Error adding health record:", error);
    throw new Error("Failed to add health record");
  }
}
