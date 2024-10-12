import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableHealthRecord } from "@/server/db/schema";

export async function findHealthRecords(horseId: string) {
  try {
    const healthRecords = await db
      .select()
      .from(tableHealthRecord)
      .where(eq(tableHealthRecord.horseId, horseId));

    return healthRecords;
  } catch (error) {
    console.error("Error fetching health records:", error);
    throw new Error("Failed to fetch health records");
  }
}
