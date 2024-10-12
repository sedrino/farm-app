import { and, desc, eq, sql } from "drizzle-orm";

import { db } from "@/server/db/connection";
import {
  tableFinancialReport,
  tableMaintenanceReport,
  tableSavedReport,
} from "@/server/db/schema";

interface FindMaintenanceReportsInput {
  page: number;
  pageSize: number;
  dateRange?: string;
  reportType?: string;
  stallId?: string;
}

export async function findMaintenanceReports(
  input: FindMaintenanceReportsInput
) {
  const { page, pageSize, dateRange, reportType, stallId } = input;

  // Base query
  const query = db.query.tableMaintenanceReport.findMany({
    with: {
      user: true,
    },
    where: and(
      dateRange
        ? sql`${tableMaintenanceReport.dateRangeStart} >= ${new Date(
            dateRange.split(" - ")[0]
          ).getTime()} AND ${tableMaintenanceReport.dateRangeEnd} <= ${new Date(
            dateRange.split(" - ")[1]
          ).getTime()}`
        : undefined,
      reportType
        ? eq(tableMaintenanceReport.reportType, reportType)
        : undefined,
      stallId ? eq(tableMaintenanceReport.stallId, stallId) : undefined
    ),
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  // Execute query
  const results = await query;

  return results;
}

interface FindReportsInput {
  page: number;
  pageSize: number;
  search?: string;
  sort: "date" | "type";
}

export async function findReports(input: FindReportsInput) {
  const { page, pageSize, search, sort } = input;

  // Base query
  const query = db.query.tableFinancialReport.findMany({
    with: {
      user: true,
    },
    where: and(
      search
        ? sql`${tableFinancialReport.name} LIKE ${`%${search}%`}`
        : undefined,
      sort === "date"
        ? sql`${tableFinancialReport.generatedAt} IS NOT NULL`
        : undefined
    ),
    limit: pageSize,
    offset: (page - 1) * pageSize,
    orderBy:
      sort === "date" ? desc(tableFinancialReport.generatedAt) : undefined,
  });

  const reports = await query;

  return reports;
}

interface FindSavedReportsInput {
  page?: number;
  pageSize?: number;
}

export async function findSavedReports(input: FindSavedReportsInput) {
  const { page = 1, pageSize = 10 } = input;

  const offset = (page - 1) * pageSize;

  const results = await db
    .select()
    .from(tableSavedReport)
    .limit(pageSize)
    .offset(offset)
    .orderBy(sql`${tableSavedReport.lastAccessed} DESC`);

  return results;
}
