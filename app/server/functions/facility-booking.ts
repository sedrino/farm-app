import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  addFacilityBooking,
  cancelBooking,
  updateFacilityBooking,
} from "@/server/db/queries/facility-booking/write";

// Define the input schema
const CancelBookingInput = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
});

export const $cancelBooking = createServerFn(
  "POST",
  async (input: z.input<typeof CancelBookingInput>) => {
    try {
      const result = CancelBookingInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const canceledBooking = await cancelBooking(result.data.bookingId);

      return {
        data: canceledBooking ?? null, // the result from the query function returns undefined if no data is found, we need to that to be translated to null
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
const CreateFacilityBookingInput = z.object({
  booking: z.object({
    facilityId: z.string().min(1, "Facility is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    purpose: z.string().min(1, "Purpose is required"),
    numberOfHorses: z.number().min(1, "At least one horse is required"),
    specialRequirements: z.string().optional(),
    termsAndConditions: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  }),
});

export const $createFacilityBooking = createServerFn(
  "POST",
  async (input: z.input<typeof CreateFacilityBookingInput>) => {
    try {
      const result = CreateFacilityBookingInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const booking = await addFacilityBooking(result.data.booking);

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
const UpdateFacilityBookingInput = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  booking: z.object({
    startTime: z.string().min(1, "Start time is required"),
    duration: z.number().min(1, "Duration is required"),
    boarderId: z.string().min(1, "Boarder ID is required"),
    purpose: z.string().min(1, "Purpose is required"),
    notes: z.string().optional(),
    status: z.enum(["pending", "approved", "denied"]).default("pending"),
  }),
});

export const $updateFacilityBooking = createServerFn(
  "POST",
  async (input: z.input<typeof UpdateFacilityBookingInput>) => {
    try {
      const result = UpdateFacilityBookingInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const updatedBooking = await updateFacilityBooking(result.data);

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
