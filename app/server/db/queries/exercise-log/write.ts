import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { ExerciseLogInsert, tableExerciseLog } from "@/server/db/schema";

export async function addExerciseLog(data: {
  horseId: string;
  exerciseLog: ExerciseLogInsert;
  goals?: string[];
  achievements?: string[];
  horseBehavior?: string;
  areasForImprovement?: string;
  mediaUrls?: string[];
}): Promise<ExerciseLogInsert> {
  const {
    horseId,
    exerciseLog,
    goals,
    achievements,
    horseBehavior,
    areasForImprovement,
    mediaUrls,
  } = data;

  // Insert the exercise log into the tableExerciseLog
  const [newExerciseLog] = await db
    .insert(tableExerciseLog)
    .values({
      horseId,
      date: exerciseLog.date,
      startTime: exerciseLog.startTime,
      endTime: exerciseLog.endTime,
      duration: exerciseLog.duration,
      type: exerciseLog.type,
      intensity: exerciseLog.intensity,
      trainer: exerciseLog.trainer,
      notes: exerciseLog.notes,
      performanceNotes: exerciseLog.performanceNotes,
      goals: JSON.stringify(goals), // Convert goals array to JSON string
      achievements: JSON.stringify(achievements), // Convert achievements array to JSON string
      horseBehavior,
      areasForImprovement,
      mediaUrls: JSON.stringify(mediaUrls), // Convert mediaUrls array to JSON string
    })
    .returning();

  // Return the newly created exercise log
  return newExerciseLog;
}

export async function deleteExerciseLog(exerciseLogId: string) {
  try {
    const results = await db
      .delete(tableExerciseLog)
      .where(eq(tableExerciseLog.exerciseLogId, exerciseLogId))
      .returning();

    return results[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete exercise log: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred while deleting exercise log");
    }
  }
}
