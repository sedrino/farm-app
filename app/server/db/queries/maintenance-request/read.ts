import { and, eq, sql } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableMaintenanceRequest } from "@/server/db/schema";

interface FindMaintenanceRequestsInput {
  page: number;
  pageSize: number;
  status?: "New" | "In Progress" | "Completed" | "Cancelled";
  priority?: "Low" | "Medium" | "High";
}

export async function findMaintenanceRequests({
  page,
  pageSize,
  status,
  priority,
}: FindMaintenanceRequestsInput) {
  const filters = [];

  if (status) {
    filters.push(eq(tableMaintenanceRequest.status, status));
  }

  if (priority) {
    filters.push(eq(tableMaintenanceRequest.priority, priority));
  }

  const [totalCount, requests] = await Promise.all([
    db
      .select({
        count: sql<number>`count(*)`.as("count"),
      })
      .from(tableMaintenanceRequest)
      .where(filters.length > 0 ? and(...filters) : undefined)
      .then((result) => result[0]?.count || 0),

    db
      .select()
      .from(tableMaintenanceRequest)
      .where(filters.length > 0 ? and(...filters) : undefined)
      .limit(pageSize)
      .offset((page - 1) * pageSize),
  ]);

  return {
    totalCount,
    items: requests,
  };
}

export async function getMaintenanceRequestById(requestId: string) {
  const results = await db
    .select()
    .from(tableMaintenanceRequest)
    .where(eq(tableMaintenanceRequest.maintenanceRequestId, requestId));

  return results[0] || null; // Return the first result or null if not found
}
