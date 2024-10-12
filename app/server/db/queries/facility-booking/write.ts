import { eq } from "drizzle-orm";

import { db } from "@/server/db/connection";
import {
  FacilityBookingInsert,
  FacilityBookingUpdate,
  tableFacilityBooking,
} from "@/server/db/schema";

export async function addFacilityBooking(bookingData: {
  facilityId: string;
  userId: string;
  startTime: number;
  endTime: number;
  purpose?: string;
  status?: string;
  duration?: number;
  notes?: string;
}): Promise<FacilityBookingInsert> {
  try {
    // Insert the new booking into the facility_booking table
    const [newBooking] = await db
      .insert(tableFacilityBooking)
      .values({
        facilityId: bookingData.facilityId,
        userId: bookingData.userId,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        purpose: bookingData.purpose,
        status: bookingData.status || "pending", // Default status if not provided
        duration: bookingData.duration,
        notes: bookingData.notes,
      })
      .returning();

    // Return the newly created booking
    return newBooking;
  } catch (error) {
    console.error("Error adding facility booking:", error);
    throw new Error("Failed to add facility booking");
  }
}

export async function cancelBooking(bookingId: string) {
  try {
    const results = await db
      .update(tableFacilityBooking)
      .set({ status: "canceled" })
      .where(eq(tableFacilityBooking.facilityBookingId, bookingId))
      .returning();

    return results[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to cancel booking: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred while canceling booking");
    }
  }
}

export async function updateFacilityBooking({
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
    console.error("Error updating facility booking:", error);
    throw new Error("Failed to update facility booking");
  }
}
