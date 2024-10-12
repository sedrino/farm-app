import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tablePastureRotation } from "@/server/db/schema";

export async function findPastureRotations() {
  try {
    const pastureRotations = await db
      .select()
      .from(tablePastureRotation)
      .where(eq(tablePastureRotation.status, "active"));

    return pastureRotations;
  } catch (error) {
    console.error("Error fetching pasture rotations:", error);
    throw new Error("Failed to fetch pasture rotations");
  }
}
