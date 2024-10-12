import { and, desc, eq, sql } from "drizzle-orm";

import { db } from "@/server/db/connection";
import { tableFacilityBooking } from "@/server/db/schema";

interface FindFacilityBookingsInput {
  page: number;
  pageSize: number;
  search?: string;
  sort?: "name" | "date";
}

export async function findFacilityBookings(input: FindFacilityBookingsInput) {
  const { page, pageSize, search, sort } = input;

  // Base query
  const query = db.query.tableFacilityBooking.findMany({
    with: {
      facility: true,
      user: true,
    },
    where: and(
      search
        ? sql`${tableFacilityBooking.purpose} LIKE ${`%${search}%`}`
        : undefined
    ),
    limit: pageSize,
    offset: (page - 1) * pageSize,
    orderBy: sort === "date" ? desc(tableFacilityBooking.startTime) : undefined,
  });

  const bookings = await query;

  return bookings;
}

export async function getFacilityBookingById(bookingId: string) {
  const results = await db
    .select()
    .from(tableFacilityBooking)
    .where(eq(tableFacilityBooking.facilityBookingId, bookingId));

  return results[0] || null; // Return the first result or null if not found
}
