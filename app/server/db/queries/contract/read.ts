import { and, eq, sql } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableContract } from "@/server/db/schema";

interface FindContractsInput {
  boarderId?: string;
  page: number;
  pageSize: number;
  search?: string;
  sort?: "expiring_soon" | "revenue_projection" | "renewal_rate";
}

export async function findContracts(input: FindContractsInput) {
  const { boarderId, page, pageSize, search, sort } = input;

  // Base query
  const query = db.query.tableContract.findMany({
    with: {
      boarder: true,
    },
    where: and(
      boarderId ? eq(tableContract.boarderId, boarderId) : undefined,
      search
        ? sql`${tableContract.termsAndConditions} LIKE ${`%${search}%`}`
        : undefined
    ),
    limit: pageSize,
    offset: (page - 1) * pageSize,
    orderBy: sort
      ? sort === "expiring_soon"
        ? sql`${tableContract.endDate} ASC`
        : sort === "revenue_projection"
          ? sql`${tableContract.paymentTerms} DESC`
          : sql`${tableContract.status} ASC`
      : undefined,
  });

  const contracts = await query;

  return contracts;
}

export async function getContractById(contractId: string) {
  const results = await db
    .select()
    .from(tableContract)
    .where(eq(tableContract.contractId, contractId));

  return results[0] || null; // Return the first result or null if not found
}
