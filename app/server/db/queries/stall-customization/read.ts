import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableStallCustomization } from "@/server/db/schema";

export async function getStallCustomizations(stallId: string) {
  try {
    const customizations = await db
      .select()
      .from(tableStallCustomization)
      .where(eq(tableStallCustomization.stallId, stallId));

    return customizations;
  } catch (error) {
    console.error("Error fetching stall customizations:", error);
    throw new Error("Failed to fetch stall customizations");
  }
}
