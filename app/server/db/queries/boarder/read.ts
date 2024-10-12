import { and, eq, ilike } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableBoarder, tableInvoice } from "@/server/db/schema";

interface FindBoardersInput {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: "name" | "contractStatus" | "lengthOfStay";
}

export async function findBoarders(input: FindBoardersInput) {
  const { page = 1, pageSize = 50, search, sort = "name" } = input;

  // Base query
  const query = db.query.tableBoarder.findMany({
    with: {
      horses: true,
    },
    where: and(search ? ilike(tableBoarder.name, `%${search}%`) : undefined),
    limit: pageSize,
    offset: (page - 1) * pageSize,
    orderBy: sort === "name" ? eq(tableBoarder.name, search) : undefined,
  });

  const results = await query;

  return results;
}

export async function getBoarderBilling(boarderId: string) {
  try {
    const invoices = await db
      .select()
      .from(tableInvoice)
      .where(eq(tableInvoice.boarderId, boarderId));

    return invoices;
  } catch (error) {
    console.error("Error fetching boarder billing information:", error);
    throw new Error("Failed to fetch boarder billing information");
  }
}

export async function getBoarderById(boarderId: string) {
  const results = await db
    .select()
    .from(tableBoarder)
    .where(eq(tableBoarder.boarderId, boarderId));

  return results[0] || null; // Return the first result or null if not found
}
