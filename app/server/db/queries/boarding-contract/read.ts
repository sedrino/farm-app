import { and, eq, sql } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableBoarder, tableBoardingContract } from "@/server/db/schema";

interface FindBoardingContractsInput {
  page: number;
  pageSize: number;
  search?: string;
  sort: "startDate" | "endDate" | "status";
}

export async function findBoardingContracts(input: FindBoardingContractsInput) {
  const { page, pageSize, search, sort } = input;

  // Base query
  const query = db
    .select({
      contractId: tableBoardingContract.boardingContractId,
      startDate: tableBoardingContract.startDate,
      endDate: tableBoardingContract.endDate,
      status: tableBoardingContract.status,
      boarder: {
        name: tableBoarder.name,
      },
    })
    .from(tableBoardingContract)
    .leftJoin(
      tableBoarder,
      eq(tableBoardingContract.boarderId, tableBoarder.boarderId)
    )
    .where(
      and(search ? sql`${tableBoarder.name} ILIKE ${`%${search}%`}` : undefined)
    )
    .orderBy(
      sort === "startDate"
        ? sql`${tableBoardingContract.startDate}`
        : sql`${tableBoardingContract.endDate}`
    )
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const contracts = await query;

  return contracts;
}
