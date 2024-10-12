import { and, eq, sql } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableFacilityBooking } from "@/server/db/schema";

interface FindBookingsInput {
  facilityId?: string;
  dateRange?: string;
}

export async function findBookings(input: FindBookingsInput) {
  const { facilityId, dateRange } = input;

  const filters = [];

  if (facilityId) {
    filters.push(eq(tableFacilityBooking.facilityId, facilityId));
  }

  if (dateRange) {
    const [startDate, endDate] = dateRange.split(",");
    filters.push(
      and(
        sql`${tableFacilityBooking.startTime} >= ${new Date(startDate).getTime()}`,
        sql`${tableFacilityBooking.endTime} <= ${new Date(endDate).getTime()}`
      )
    );
  }

  const bookings = await db.query.tableFacilityBooking.findMany({
    where: and(...filters),
  });

  return bookings;
}

export async function getBookingById(bookingId: string) {
  const results = await db
    .select()
    .from(tableFacilityBooking)
    .where(eq(tableFacilityBooking.facilityBookingId, bookingId));

  return results[0] || null; // Return the first result or null if not found
}
