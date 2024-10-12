import { like } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableSupplier } from "@/server/db/schema";

export async function findSuppliers({
  page,
  pageSize,
  search,
}: {
  page: number;
  pageSize: number;
  search?: string;
}) {
  const offset = (page - 1) * pageSize;

  const query = db
    .select()
    .from(tableSupplier)
    .limit(pageSize)
    .offset(offset)
    .orderBy(tableSupplier.name);

  if (search) {
    query.where(like(tableSupplier.name, `%${search}%`));
  }

  const suppliers = await query;

  return suppliers;
}
