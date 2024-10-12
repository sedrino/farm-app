import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableFeedingSchedule } from "@/server/db/schema";

interface FindFeedingSchedulesInput {
  horseId: string;
  page: number;
  pageSize: number;
  search?: string;
  sort: "time" | "date";
}

export async function findFeedingSchedules(input: FindFeedingSchedulesInput) {
  const { horseId, page, pageSize, search, sort } = input;

  // Base query
  const query = db
    .select()
    .from(tableFeedingSchedule)
    .where(eq(tableFeedingSchedule.horseId, horseId));

  // Add search filter if provided
  if (search) {
    query.where(eq(tableFeedingSchedule.feedType, search));
  }

  // Add sorting
  if (sort === "time") {
    query.orderBy(tableFeedingSchedule.feedingTime);
  } else if (sort === "date") {
    query.orderBy(tableFeedingSchedule.createdAt);
  }

  // Pagination
  query.limit(pageSize).offset((page - 1) * pageSize);

  // Execute the query
  const feedingSchedules = await query;

  return feedingSchedules;
}
