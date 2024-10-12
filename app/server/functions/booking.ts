import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { addBooking, updateBooking } from "@/server/db/queries/booking/write";

// Define the input schema
const CreateBookingInput = z.object({
  facilityId: z.string().min(1, "Facility ID is required"),
  startTime: z.number().min(1, "Start time is required"),
  endTime: z.number().min(1, "End time is required"),
});

export const $createBooking = createServerFn(
  "POST",
  async (input: z.input<typeof CreateBookingInput>) => {
    try {
      const result = CreateBookingInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const booking = await addBooking(result.data);

      return {
        booking,
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
const UpdateBookingInput = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  booking: z.object({
    facilityId: z.string().min(1, "Facility is required"),
    userId: z.string().min(1, "User is required"),
    startTime: z.number().min(1, "Start time is required"),
    endTime: z.number().min(1, "End time is required"),
    purpose: z.string().optional(),
    status: z.string().min(1, "Status is required"),
  }),
});

export const $updateBooking = createServerFn(
  "POST",
  async (input: z.input<typeof UpdateBookingInput>) => {
    try {
      const result = UpdateBookingInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const updatedBooking = await updateBooking(result.data);

      return {
        booking: updatedBooking,
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
