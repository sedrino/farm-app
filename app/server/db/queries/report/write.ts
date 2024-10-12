import { and, eq, sql } from "drizzle-orm";

import { db } from "@/server/db/connection";
import {
  FinancialReportInsert,
  tableFinancialReport,
  tableMaintenanceReport,
} from "@/server/db/schema";

export async function addReport(reportData: FinancialReportInsert) {
  try {
    // Insert the report data into the financial_report table
    const [newReport] = await db
      .insert(tableFinancialReport)
      .values(reportData)
      .returning();

    // Return the newly created report
    return newReport;
  } catch (error) {
    console.error("Error adding report:", error);
    throw new Error("Failed to add report");
  }
}

export async function deleteReport(reportId: string) {
  try {
    const results = await db
      .delete(tableFinancialReport)
      .where(eq(tableFinancialReport.financialReportId, reportId))
      .returning();

    return results[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete report: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred while deleting report");
    }
  }
}

export async function generateMaintenanceReport(reportData: any) {
  try {
    // Insert the report data into the maintenance_report table
    const result = await db
      .insert(tableMaintenanceReport)
      .values({
        reportType: reportData.reportType,
        dateRangeStart: reportData.dateRangeStart,
        dateRangeEnd: reportData.dateRangeEnd,
        filters: reportData.filters,
        reportData: reportData.reportData,
        exportFormat: reportData.exportFormat,
        generatedAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
      .returning();

    // Return the generated report
    return result[0];
  } catch (error) {
    console.error("Error generating maintenance report:", error);
    throw new Error("Failed to generate maintenance report");
  }
}

interface GenerateReportInput {
  report: {
    reportType: "facility_usage" | "event_participation" | "visitor_frequency";
    dateRange: string;
    filters: {
      facilityId?: string;
      eventTypeId?: string;
      visitorId?: string;
    };
    grouping?: "week" | "month" | "facility_type";
  };
}

export async function generateReport(input: GenerateReportInput) {
  const { reportType, dateRange, filters, grouping } = input.report;

  // Parse the date range
  const [startDate, endDate] = dateRange
    .split(",")
    .map((date) => new Date(date).getTime());

  // Build the query based on the report type
  let query;

  switch (reportType) {
    case "facility_usage":
      query = db
        .select({
          facilityId: sql`facility_id`,
          usage: sql`SUM(${sql`end_time - start_time`})`,
        })
        .from("facility_usage")
        .where(
          and(
            sql`${sql`facility_id`} = ${filters.facilityId}`,
            sql`${sql`usage_date`} BETWEEN ${startDate} AND ${endDate}`
          )
        )
        .groupBy("facility_id");
      break;

    case "event_participation":
      query = db
        .select({
          eventId: sql`event_id`,
          participation: sql`COUNT(${sql`user_id`})`,
        })
        .from("event_participation")
        .where(
          and(
            sql`${sql`event_id`} = ${filters.eventTypeId}`,
            sql`${sql`participation_date`} BETWEEN ${startDate} AND ${endDate}`
          )
        )
        .groupBy("event_id");
      break;

    case "visitor_frequency":
      query = db
        .select({
          visitorId: sql`visitor_id`,
          frequency: sql`COUNT(${sql`visit_date`})`,
        })
        .from("visitor_frequency")
        .where(
          and(
            sql`${sql`visitor_id`} = ${filters.visitorId}`,
            sql`${sql`visit_date`} BETWEEN ${startDate} AND ${endDate}`
          )
        )
        .groupBy("visitor_id");
      break;

    default:
      throw new Error("Invalid report type");
  }

  // Execute the query and get the results
  const results = await query;

  // Save the report data to the database
  const reportData = {
    reportType,
    dateRangeStart: startDate,
    dateRangeEnd: endDate,
    reportData: results,
  };

  const savedReport = await db
    .insert(tableFinancialReport)
    .values(reportData)
    .returning();

  return savedReport[0];
}
