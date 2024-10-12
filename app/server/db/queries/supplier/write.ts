import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableSupplier } from "@/server/db/schema";

export async function deleteSupplier(supplierId: string) {
  try {
    const results = await db
      .delete(tableSupplier)
      .where(eq(tableSupplier.supplierId, supplierId))
      .returning();

    return results[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete supplier: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred while deleting supplier");
    }
  }
}
