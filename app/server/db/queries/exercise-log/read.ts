import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableExerciseLog } from "@/server/db/schema";

export async function findExerciseLogs({
  horseId,
  page = 1,
  pageSize = 10,
}: {
  horseId: string;
  page?: number;
  pageSize?: number;
}) {
  const offset = (page - 1) * pageSize;

  const results = await db
    .select()
    .from(tableExerciseLog)
    .where(eq(tableExerciseLog.horseId, horseId))
    .limit(pageSize)
    .offset(offset);

  return results;
}
