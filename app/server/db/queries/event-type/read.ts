import { db } from "@/server/db/connection";
import { tableEventType } from "@/server/db/schema";

export async function findEventTypes() {
  try {
    const eventTypes = await db.select().from(tableEventType);
    return eventTypes;
  } catch (error) {
    console.error("Error fetching event types:", error);
    throw new Error("Failed to fetch event types");
  }
}
