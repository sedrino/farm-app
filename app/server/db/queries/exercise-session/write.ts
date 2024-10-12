import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableExerciseLog } from "@/server/db/schema";

export async function deleteExerciseSession(sessionId: string) {
  try {
    const results = await db
      .delete(tableExerciseLog)
      .where(eq(tableExerciseLog.exerciseLogId, sessionId))
      .returning();

    return results[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete exercise session: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred while deleting exercise session");
    }
  }
}
