import { and, eq, ilike } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableContractTemplate } from "@/server/db/schema";

export async function findContractTemplates({
  page,
  pageSize,
  search,
}: {
  page: number;
  pageSize: number;
  search?: string;
}) {
  const offset = (page - 1) * pageSize;

  const filters = [];
  if (search) {
    filters.push(ilike(tableContractTemplate.name, `%${search}%`));
  }

  const query = db
    .select()
    .from(tableContractTemplate)
    .where(filters.length > 0 ? and(...filters) : undefined)
    .limit(pageSize)
    .offset(offset);

  const results = await query;

  return results;
}
