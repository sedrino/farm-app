import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  addFacility,
  deleteFacility,
} from "@/server/db/queries/facility/write";

// Define the input schema
const CreateFacilityInput = z.object({
  facility: z.object({
    name: z.string().min(1, "Facility name is required"),
    type: z.string().min(1, "Facility type is required"),
    capacity: z.number().min(1, "Capacity must be at least 1"),
    description: z.string().optional(),
    amenities: z.string().optional(),
    bookingRules: z.string().optional(),
  }),
  photos: z.array(z.string()).default([]).optional(),
});

export const $createFacility = createServerFn(
  "POST",
  async (input: z.input<typeof CreateFacilityInput>) => {
    try {
      const result = CreateFacilityInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const facility = await addFacility(result.data);

      return {
        facility,
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
const DeleteFacilityInput = z.object({
  facilityId: z.string().min(1, "Facility ID is required"),
});

export const $deleteFacility = createServerFn(
  "POST",
  async (input: z.input<typeof DeleteFacilityInput>) => {
    try {
      const result = DeleteFacilityInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      await deleteFacility(result.data.facilityId);

      return {
        success: true,
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
