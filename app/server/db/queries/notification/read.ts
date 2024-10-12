import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableNotification } from "@/server/db/schema";

export async function findNotifications() {
  try {
    const notifications = await db
      .select()
      .from(tableNotification)
      .where(eq(tableNotification.isRead, false)); // Fetch only unread notifications

    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw new Error("Failed to fetch notifications");
  }
}
