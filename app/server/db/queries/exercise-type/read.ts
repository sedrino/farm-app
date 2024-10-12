import { db } from "@/server/db/connection";
import { tableExerciseType } from "@/server/db/schema";

export async function findExerciseTypes() {
  try {
    const exerciseTypes = await db.select().from(tableExerciseType);
    return exerciseTypes;
  } catch (error) {
    console.error("Error fetching exercise types:", error);
    throw new Error("Failed to fetch exercise types");
  }
}
