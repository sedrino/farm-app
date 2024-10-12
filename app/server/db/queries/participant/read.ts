import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableUser } from "@/server/db/schema";

export async function findParticipants() {
  try {
    const participants = await db
      .select()
      .from(tableUser)
      .where(eq(tableUser.isActive, true));

    return participants;
  } catch (error) {
    console.error("Error fetching participants:", error);
    throw new Error("Failed to fetch participants");
  }
}
