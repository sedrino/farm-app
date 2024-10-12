import { and, eq, sql } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableEvent } from "@/server/db/schema";

interface FindEventsInput {
  page?: number;
  pageSize?: number;
  eventType?: string;
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
  facilityId?: string;
  participantId?: string;
}

export async function findEvents(input: FindEventsInput) {
  const {
    page = 1,
    pageSize = 10,
    eventType,
    dateRange,
    facilityId,
    participantId,
  } = input;

  const filters = [];

  if (eventType) {
    filters.push(eq(tableEvent.eventType, eventType));
  }

  if (dateRange?.startDate) {
    filters.push(sql`${tableEvent.startDate} >= ${dateRange.startDate}`);
  }

  if (dateRange?.endDate) {
    filters.push(sql`${tableEvent.endDate} <= ${dateRange.endDate}`);
  }

  if (facilityId) {
    filters.push(eq(tableEvent.facilityId, facilityId));
  }

  if (participantId) {
    filters.push(eq(tableEvent.eventId, participantId));
  }

  const events = await db.query.tableEvent.findMany({
    with: {
      eventParticipants: true,
    },
    where: and(...filters),
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  return events;
}

export async function findEventsByType({
  eventType,
  page = 1,
  pageSize = 10,
}: {
  eventType: string;
  page?: number;
  pageSize?: number;
}) {
  const offset = (page - 1) * pageSize;

  const events = await db
    .select()
    .from(tableEvent)
    .where(eq(tableEvent.eventType, eventType))
    .limit(pageSize)
    .offset(offset);

  return events;
}

export async function getEventById(eventId: string) {
  const results = await db
    .select()
    .from(tableEvent)
    .where(eq(tableEvent.eventId, eventId));

  return results[0] || null; // Return the first result or null if not found
}
