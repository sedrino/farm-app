import { db } from "@/server/db/connection";
import { tableReportTemplate } from "@/server/db/schema";

export async function findReportTypes() {
  try {
    const reportTypes = await db
      .select({
        value: tableReportTemplate.reportType,
        label: tableReportTemplate.name,
      })
      .from(tableReportTemplate);

    return reportTypes;
  } catch (error) {
    console.error("Error fetching report types:", error);
    throw new Error("Failed to fetch report types");
  }
}
