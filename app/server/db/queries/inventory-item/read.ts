import { and, eq, ilike } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableInventoryItem } from "@/server/db/schema";

interface FindInventoryItemsInput {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: "name" | "category" | "quantity";
}

export async function findInventoryItems(input: FindInventoryItemsInput) {
  const { page = 1, pageSize = 50, search, sort = "name" } = input;

  // Base query
  const query = db
    .select()
    .from(tableInventoryItem)
    .where(search ? ilike(tableInventoryItem.name, `%${search}%`) : undefined);

  // Sorting
  if (sort === "name") {
    query.orderBy(tableInventoryItem.name);
  } else if (sort === "category") {
    query.orderBy(tableInventoryItem.category);
  } else if (sort === "quantity") {
    query.orderBy(tableInventoryItem.quantity);
  }

  // Pagination
  query.limit(pageSize).offset((page - 1) * pageSize);

  const results = await query;

  return results;
}

export async function getInventoryItemById(itemId: string) {
  const results = await db
    .select()
    .from(tableInventoryItem)
    .where(eq(tableInventoryItem.inventoryItemId, itemId));

  return results[0] || null; // Return the first result or null if not found
}
