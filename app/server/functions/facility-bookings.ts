import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  findFacilityBookings,
  getFacilityBookingById,
} from "@/server/db/queries/facility-booking/read";

// Define the input schema
const GetFacilityBookingByIdInput = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
});

export const $getFacilityBookingById = createServerFn(
  "GET",
  async (input: z.input<typeof GetFacilityBookingByIdInput>) => {
    try {
      const result = GetFacilityBookingByIdInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const facilityBooking = await getFacilityBookingById(
        result.data.bookingId
      );

      return {
        data: facilityBooking ?? null, // Return null if no data is found
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
const ListFacilityBookingsInput = z.object({
  page: z.number().min(1).catch(1),
  pageSize: z.number().min(1).catch(50),
  search: z.string().optional(),
  sort: z.enum(["name", "date"]).catch("name"),
});

export const $listFacilityBookings = createServerFn(
  "GET",
  async (input: z.input<typeof ListFacilityBookingsInput>) => {
    try {
      const result = ListFacilityBookingsInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const bookings = await findFacilityBookings(result.data);

      return {
        data: bookings ?? [],
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
