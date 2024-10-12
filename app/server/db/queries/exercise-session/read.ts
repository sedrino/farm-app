import { and, eq, sql } from "drizzle-orm";

import { db } from "@/server/db/connection";
import {
  tableExerciseLog,
  tableExerciseType,
  tableHorse,
} from "@/server/db/schema";

interface FindExerciseSessionsCountParams {
  horseId?: string;
  exerciseTypeId?: string;
  trainerId?: string;
  dateRange?: string;
}

export async function findExerciseSessionsCount({
  horseId,
  exerciseTypeId,
  trainerId,
  dateRange,
}: FindExerciseSessionsCountParams): Promise<number> {
  const filters = [];

  if (horseId) {
    filters.push(eq(tableExerciseLog.horseId, horseId));
  }

  if (exerciseTypeId) {
    filters.push(eq(tableExerciseLog.type, exerciseTypeId));
  }

  if (trainerId) {
    filters.push(eq(tableExerciseLog.trainer, trainerId));
  }

  if (dateRange) {
    const [startDate, endDate] = dateRange.split(",");
    filters.push(
      and(
        sql`${tableExerciseLog.date} >= ${new Date(startDate).getTime()}`,
        sql`${tableExerciseLog.date} <= ${new Date(endDate).getTime()}`
      )
    );
  }

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(tableExerciseLog)
    .where(and(...filters))
    .get();

  return result?.count || 0;
}

interface FindExerciseSessionsPaginatedInput {
  page: number;
  pageSize: number;
  horseId?: string;
  exerciseTypeId?: string;
  trainerId?: string;
  dateRange?: string;
}

export async function findExerciseSessionsPaginated({
  page,
  pageSize,
  horseId,
  exerciseTypeId,
  trainerId,
  dateRange,
}: FindExerciseSessionsPaginatedInput) {
  const offset = (page - 1) * pageSize;

  const filters = [];

  if (horseId) {
    filters.push(eq(tableHorse.horseId, horseId));
  }

  if (exerciseTypeId) {
    filters.push(eq(tableExerciseType.exerciseTypeId, exerciseTypeId));
  }

  if (trainerId) {
    filters.push(eq(tableExerciseLog.trainer, trainerId));
  }

  if (dateRange) {
    const [startDate, endDate] = dateRange.split(",");
    filters.push(
      and(
        sql`${tableExerciseLog.date} >= ${new Date(startDate).getTime()}`,
        sql`${tableExerciseLog.date} <= ${new Date(endDate).getTime()}`
      )
    );
  }

  const query = db
    .select({
      sessionId: tableExerciseLog.exerciseLogId,
      date: tableExerciseLog.date,
      startTime: tableExerciseLog.startTime,
      endTime: tableExerciseLog.endTime,
      horse: {
        horseId: tableHorse.horseId,
        name: tableHorse.name,
      },
      exerciseType: {
        exerciseTypeId: tableExerciseType.exerciseTypeId,
        name: tableExerciseType.name,
      },
    })
    .from(tableExerciseLog)
    .leftJoin(tableHorse, eq(tableExerciseLog.horseId, tableHorse.horseId))
    .leftJoin(
      tableExerciseType,
      eq(tableExerciseLog.type, tableExerciseType.exerciseTypeId)
    )
    .where(and(...filters))
    .limit(pageSize)
    .offset(offset);

  return query;
}
