import { and, desc, eq, ilike } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableMessage } from "@/server/db/schema";

interface FindMessagesInput {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: "date" | "sender";
}

export async function findMessages(input: FindMessagesInput) {
  const { page = 1, pageSize = 50, search, sort = "date" } = input;

  // Base query
  const query = db.query.tableMessage.findMany({
    with: {
      user: true,
    },
    where: and(search ? ilike(tableMessage.content, `%${search}%`) : undefined),
    limit: pageSize,
    offset: (page - 1) * pageSize,
    orderBy: sort === "date" ? desc(tableMessage.sentAt) : undefined,
  });

  const messages = await query;

  return messages;
}

export async function getMessageById(messageId: string) {
  const results = await db
    .select()
    .from(tableMessage)
    .where(eq(tableMessage.messageId, messageId));

  return results[0] || null; // Return the first result or null if not found
}
