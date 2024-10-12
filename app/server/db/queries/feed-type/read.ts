import { db } from "@/server/db/connection";
import { tableFeedType } from "@/server/db/schema";

export async function findFeedTypes() {
  try {
    const feedTypes = await db.select().from(tableFeedType);
    return feedTypes;
  } catch (error) {
    console.error("Error fetching feed types:", error);
    throw new Error("Failed to fetch feed types");
  }
}
