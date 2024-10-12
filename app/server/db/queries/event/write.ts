import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import {
  EventInsert,
  EventUpdate,
  tableEvent,
  tableEventParticipant,
} from "@/server/db/schema";

export async function addEvent(eventData: EventInsert) {
  try {
    // Insert the event data into the tableEvent
    const [newEvent] = await db
      .insert(tableEvent)
      .values(eventData)
      .returning();

    // Return the newly created event
    return newEvent;
  } catch (error) {
    console.error("Error adding event:", error);
    throw new Error("Failed to add event");
  }
}

export async function cancelRegistration(eventId: string) {
  try {
    const result = await db
      .delete(tableEventParticipant)
      .where(eq(tableEventParticipant.eventId, eventId))
      .returning();

    return result[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to cancel registration: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred while canceling registration");
    }
  }
}

export async function deleteEvent(eventId: string) {
  try {
    const results = await db
      .delete(tableEvent)
      .where(eq(tableEvent.eventId, eventId))
      .returning();

    return results[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete event: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred while deleting event");
    }
  }
}

export async function updateEvent({
  eventId,
  event,
}: {
  eventId: string;
  event: EventUpdate;
}) {
  try {
    const updatedEvents = await db
      .update(tableEvent)
      .set(event)
      .where(eq(tableEvent.eventId, eventId))
      .returning();

    return updatedEvents[0];
  } catch (error) {
    console.error("Error updating event:", error);
    throw new Error("Failed to update event");
  }
}
