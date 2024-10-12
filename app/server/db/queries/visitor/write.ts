import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableVisit, tableVisitor, VisitorInsert } from "@/server/db/schema";

export async function addVisitor(visitorData: VisitorInsert) {
  try {
    // Insert the new visitor data into the tableVisitor
    const [newVisitor] = await db
      .insert(tableVisitor)
      .values(visitorData)
      .returning();

    // Return the newly created visitor
    return newVisitor;
  } catch (error) {
    console.error("Error adding visitor:", error);
    throw new Error("Failed to add visitor");
  }
}

export async function checkInVisitor(visitorId: string) {
  const currentTime = Math.floor(Date.now() / 1000); // Assuming the timestamp is in seconds

  // Update the visitor's check-in status and time
  const updatedVisitor = await db
    .update(tableVisitor)
    .set({
      accessStatus: "checked_in",
      lastVisitDate: currentTime,
    })
    .where(eq(tableVisitor.visitorId, visitorId))
    .returning();

  // Create a new visit record
  const newVisit = await db.insert(tableVisit).values({
    visitorId,
    visitDate: currentTime,
    purpose: "Check-in",
    duration: "1 hour", // Default duration, you can adjust as needed
    checkInTime: currentTime,
    checkInStatus: "checked_in",
  });

  return {
    visitor: updatedVisitor[0],
    visit: newVisit,
  };
}

export async function deleteVisitor(visitorId: string) {
  try {
    const results = await db
      .delete(tableVisitor)
      .where(eq(tableVisitor.visitorId, visitorId))
      .returning();

    return results[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete visitor: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred while deleting visitor");
    }
  }
}
