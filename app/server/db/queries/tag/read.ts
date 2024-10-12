import { db } from "@/server/db/connection";
import { tableTag } from "@/server/db/schema";

export async function findTags() {
  try {
    const tags = await db.select().from(tableTag);
    return tags;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw new Error("Failed to fetch tags");
  }
}
