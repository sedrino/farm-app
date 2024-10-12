import { and, eq, sql } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableMaintenanceTask } from "@/server/db/schema";

interface FindMaintenanceTasksInput {
  page: number;
  pageSize: number;
  filter?: string;
}

export async function findMaintenanceTasks(input: FindMaintenanceTasksInput) {
  const { page, pageSize, filter } = input;

  // Base query to select maintenance tasks
  const query = db.query.tableMaintenanceTask.findMany({
    with: {
      stall: true,
    },
    where: and(
      filter
        ? sql`${tableMaintenanceTask.taskName} LIKE ${`%${filter}%`}`
        : undefined
    ),
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  // Execute the query and return the results
  return await query;
}

interface FindScheduledMaintenanceTasksInput {
  page: number;
  pageSize: number;
  filter: "overdue" | "today" | "future";
}

export async function findScheduledMaintenanceTasks({
  page,
  pageSize,
  filter,
}: FindScheduledMaintenanceTasksInput) {
  const currentDate = Math.floor(Date.now() / 1000); // Assuming the timestamp is in seconds

  let dateCondition;
  switch (filter) {
    case "overdue":
      dateCondition = sql`${tableMaintenanceTask.scheduledDate} < ${currentDate}`;
      break;
    case "today":
      dateCondition = sql`${tableMaintenanceTask.scheduledDate} >= ${currentDate} AND ${tableMaintenanceTask.scheduledDate} < ${currentDate + 86400}`; // 86400 seconds in a day
      break;
    case "future":
      dateCondition = sql`${tableMaintenanceTask.scheduledDate} >= ${currentDate + 86400}`;
      break;
  }

  const scheduledTasks = await db
    .select()
    .from(tableMaintenanceTask)
    .where(and(dateCondition))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return scheduledTasks;
}

export async function getMaintenanceTaskById(taskId: string) {
  const results = await db
    .select()
    .from(tableMaintenanceTask)
    .where(eq(tableMaintenanceTask.maintenanceTaskId, taskId));

  return results[0] || null; // Return the first result or null if not found
}
