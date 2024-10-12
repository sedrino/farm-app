import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  findShiftsPaginated,
  getShiftById,
} from "@/server/db/queries/shift/read";

// Define the input schema
const GetShiftByIdInput = z.object({
  shiftId: z.string().min(1, "Shift ID is required"),
});

export const $getShiftById = createServerFn(
  "GET",
  async (input: z.input<typeof GetShiftByIdInput>) => {
    try {
      const result = GetShiftByIdInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const shift = await getShiftById(result.data.shiftId);

      return {
        data: shift ?? null, // Return null if no shift is found
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

// Define the input schema for listing shifts
const ListShiftsInput = z.object({
  page: z.number().catch(1),
  pageSize: z.number().catch(50),
  search: z.string().optional(),
  sort: z.enum(["date", "staff", "role"]).catch("date"),
});

export const $listShifts = createServerFn(
  "GET",
  async (input: z.input<typeof ListShiftsInput>) => {
    try {
      const result = ListShiftsInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const shifts = await findShiftsPaginated(result.data);

      return {
        data: shifts ?? [],
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
