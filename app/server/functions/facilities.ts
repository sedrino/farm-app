import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  findFacilities,
  getFacilityById,
} from "@/server/db/queries/facility/read";

// Define the input schema
const GetFacilityByIdInput = z.object({
  facilityId: z.string().min(1, "Facility ID is required"),
});

export const $getFacilityById = createServerFn(
  "GET",
  async (input: z.input<typeof GetFacilityByIdInput>) => {
    try {
      const result = GetFacilityByIdInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const facility = await getFacilityById(result.data.facilityId);

      return {
        data: facility ?? null, // Return null if no facility is found
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
const ListFacilitiesInput = z.object({});

export const $listFacilities = createServerFn(
  "GET",
  async (input: z.input<typeof ListFacilitiesInput>) => {
    try {
      const result = ListFacilitiesInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const facilities = await findFacilities();

      return {
        data: facilities ?? [], // Return an empty array if no facilities are found
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
