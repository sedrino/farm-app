import { and, eq, ilike } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableInventoryCategory } from "@/server/db/schema";

interface FindInventoryCategoriesInput {
  page: number;
  pageSize: number;
  search?: string;
}

export async function findInventoryCategories(
  input: FindInventoryCategoriesInput
) {
  const { page, pageSize, search } = input;

  // Calculate offset for pagination
  const offset = (page - 1) * pageSize;

  // Build the query
  const query = db
    .select()
    .from(tableInventoryCategory)
    .where(
      search ? ilike(tableInventoryCategory.name, `%${search}%`) : undefined
    )
    .limit(pageSize)
    .offset(offset);

  // Execute the query and return the results
  return await query;
}
