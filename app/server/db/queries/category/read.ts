import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableExpenseCategory, tableIncomeCategory } from "@/server/db/schema";

export async function findCategories({
  page,
  pageSize,
  type,
}: {
  page: number;
  pageSize: number;
  type: "income" | "expense";
}) {
  const offset = (page - 1) * pageSize;

  if (type === "income") {
    return db.select().from(tableIncomeCategory).limit(pageSize).offset(offset);
  } else {
    return db
      .select()
      .from(tableExpenseCategory)
      .limit(pageSize)
      .offset(offset);
  }
}
