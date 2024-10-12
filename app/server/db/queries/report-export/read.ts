import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableReportExport } from "@/server/db/schema";

export async function findReportExports() {
  try {
    const reportExports = await db.select().from(tableReportExport).all();

    return reportExports;
  } catch (error) {
    console.error("Error fetching report exports:", error);
    throw new Error("Failed to fetch report exports");
  }
}

export async function getReportExportById(reportExportId: string) {
  const results = await db
    .select()
    .from(tableReportExport)
    .where(eq(tableReportExport.reportExportId, reportExportId));

  return results[0] || null; // Return the first result or null if not found
}
