import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableMessage } from "@/server/db/schema";

export async function deleteMessage(messageId: string) {
  try {
    const results = await db
      .delete(tableMessage)
      .where(eq(tableMessage.messageId, messageId))
      .returning();

    return results[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete message: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred while deleting message");
    }
  }
}

interface FlagMessageInput {
  messageId: string;
  reason: string;
}

export async function flagMessage(input: FlagMessageInput) {
  const { messageId, reason } = input;

  // Update the message to set it as flagged and add the reason
  const [flaggedMessage] = await db
    .update(tableMessage)
    .set({
      isFlagged: true,
      flagReason: reason,
    })
    .where(eq(tableMessage.messageId, messageId))
    .returning();

  return flaggedMessage;
}
