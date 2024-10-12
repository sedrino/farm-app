import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableUser } from "@/server/db/schema";

export async function findOwners() {
  try {
    const owners = await db
      .select()
      .from(tableUser)
      .where(eq(tableUser.role, "owner"));

    return owners;
  } catch (error) {
    console.error("Error fetching owners:", error);
    throw new Error("Failed to fetch owners");
  }
}
