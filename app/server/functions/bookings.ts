import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { findBookings, getBookingById } from "@/server/db/queries/booking/read";

// Define the input schema
const GetBookingByIdInput = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
});

export const $getBookingById = createServerFn(
  "GET",
  async (input: z.input<typeof GetBookingByIdInput>) => {
    try {
      const result = GetBookingByIdInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const booking = await getBookingById(result.data.bookingId);

      return {
        data: booking ?? null, // the result from the query function returns undefined if no data is found, we need to that to be translated to null
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          error: error.message,
        };
      } else {
        return {
          error: "Unknown error",
        };
      }
    }
  }
);

// Define the input schema
const ListBookingsInput = z.object({
  facilityId: z.string().optional(),
  dateRange: z.string().optional(),
});

export const $listBookings = createServerFn(
  "GET",
  async (input: z.input<typeof ListBookingsInput>) => {
    try {
      const result = ListBookingsInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const bookings = await findBookings(result.data);

      return {
        data: bookings ?? [], // Return an empty array if no bookings are found
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          error: error.message,
        };
      } else {
        return {
          error: "Unknown error",
        };
      }
    }
  }
);
