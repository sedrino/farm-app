import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableTransaction } from "@/server/db/schema";

export async function deleteTransaction(transactionId: string) {
  try {
    const results = await db
      .delete(tableTransaction)
      .where(eq(tableTransaction.transactionId, transactionId))
      .returning();

    return results[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete transaction: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred while deleting transaction");
    }
  }
}
