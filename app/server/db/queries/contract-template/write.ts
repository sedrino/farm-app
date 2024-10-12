import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableContractTemplate } from "@/server/db/schema";

export async function deleteContractTemplate(templateId: string) {
  try {
    const results = await db
      .delete(tableContractTemplate)
      .where(eq(tableContractTemplate.contractTemplateId, templateId))
      .returning();

    return results[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete contract template: ${error.message}`);
    } else {
      throw new Error(
        "Unknown error occurred while deleting contract template"
      );
    }
  }
}
