import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import {
  FacilityBookingInsert,
  FacilityBookingUpdate,
  tableFacilityBooking,
} from "@/server/db/schema";

export async function addBooking(data: {
  facilityId: string;
  startTime: number;
  endTime: number;
}): Promise<FacilityBookingInsert> {
  try {
    // Insert the booking data into the facility_booking table
    const [newBooking] = await db
      .insert(tableFacilityBooking)
      .values({
        facilityId: data.facilityId,
        startTime: data.startTime,
        endTime: data.endTime,
        status: "confirmed", // Default status
      })
      .returning();

    return newBooking;
  } catch (error) {
    console.error("Error adding booking:", error);
    throw new Error("Failed to add booking");
  }
}

export async function updateBooking({
  bookingId,
  booking,
}: {
  bookingId: string;
  booking: FacilityBookingUpdate;
}): Promise<FacilityBookingUpdate | null> {
  try {
    const [updatedBooking] = await db
      .update(tableFacilityBooking)
      .set(booking)
      .where(eq(tableFacilityBooking.facilityBookingId, bookingId))
      .returning();

    return updatedBooking || null;
  } catch (error) {
    console.error("Error updating booking:", error);
    throw new Error("Failed to update booking");
  }
}
