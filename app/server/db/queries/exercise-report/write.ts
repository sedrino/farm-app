import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableExerciseReport } from "@/server/db/schema";

export async function deleteExerciseReport(reportId: string) {
  try {
    const results = await db
      .delete(tableExerciseReport)
      .where(eq(tableExerciseReport.exerciseReportId, reportId))
      .returning();

    return results[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete exercise report: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred while deleting exercise report");
    }
  }
}
