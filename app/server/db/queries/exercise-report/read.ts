import { and, eq, ilike } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableExerciseReport } from "@/server/db/schema";

interface FindExerciseReportsInput {
  page: number;
  pageSize: number;
  search?: string;
  sort: "date" | "horse" | "type";
}

export async function findExerciseReports(input: FindExerciseReportsInput) {
  const { page, pageSize, search, sort } = input;

  // Base query
  const query = db.query.tableExerciseReport.findMany({
    with: {
      horses: true,
    },
    where: and(
      search ? ilike(tableExerciseReport.reportName, `%${search}%`) : undefined
    ),
    limit: pageSize,
    offset: (page - 1) * pageSize,
    orderBy:
      sort === "date"
        ? eq(tableExerciseReport.startDate, tableExerciseReport.endDate)
        : undefined,
  });

  // Execute query
  const results = await query;

  return results;
}
