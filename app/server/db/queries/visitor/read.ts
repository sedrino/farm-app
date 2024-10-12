import { and, desc, eq, ilike } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableVisitor } from "@/server/db/schema";

interface FindVisitorsInput {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: "name" | "type" | "date";
}

export async function findVisitors(input: FindVisitorsInput) {
  const { page = 1, pageSize = 10, search, sort = "name" } = input;

  // Base query
  const query = db.query.tableVisitor.findMany({
    with: {
      boarder: true,
    },
    where: and(search ? ilike(tableVisitor.name, `%${search}%`) : undefined),
    limit: pageSize,
    offset: (page - 1) * pageSize,
    orderBy:
      sort === "name"
        ? asc(tableVisitor.name)
        : desc(tableVisitor.lastVisitDate),
  });

  const visitors = await query;

  return visitors;
}

export async function getVisitorById(visitorId: string) {
  const results = await db
    .select()
    .from(tableVisitor)
    .where(eq(tableVisitor.visitorId, visitorId));

  return results[0] || null; // Return the first result or null if not found
}
