import { db } from "@/server/db/connection";
import { AnnouncementInsert, tableAnnouncement } from "@/server/db/schema";

export async function addAnnouncement(data: AnnouncementInsert) {
  try {
    // Insert the new announcement into the tableAnnouncement
    const [newAnnouncement] = await db
      .insert(tableAnnouncement)
      .values(data)
      .returning();

    // Return the newly created announcement
    return newAnnouncement;
  } catch (error) {
    console.error("Error adding announcement:", error);
    throw new Error("Failed to add announcement");
  }
}
