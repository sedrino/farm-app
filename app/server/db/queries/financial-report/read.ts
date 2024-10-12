import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableFinancialReport } from "@/server/db/schema";

export async function getFinancialReportById(reportId: string) {
  const results = await db
    .select()
    .from(tableFinancialReport)
    .where(eq(tableFinancialReport.financialReportId, reportId));

  return results[0] || null; // Return the first result or null if not found
}
