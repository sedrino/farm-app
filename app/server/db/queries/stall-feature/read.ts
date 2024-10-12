import { db } from "@/server/db/connection";
import { tableStallFeature } from "@/server/db/schema";

export async function findStallFeatures() {
  try {
    const stallFeatures = await db.select().from(tableStallFeature);
    return stallFeatures;
  } catch (error) {
    console.error("Error fetching stall features:", error);
    throw new Error("Failed to fetch stall features");
  }
}
