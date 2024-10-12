import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  findStaffSchedules,
  getStaffSchedule,
} from "@/server/db/queries/staff-schedule/read";

// Define the input schema
const GetStaffScheduleInput = z.object({
  staffId: z.string().min(1, "Staff ID is required"),
});

export const $getStaffSchedule = createServerFn(
  "GET",
  async (input: z.input<typeof GetStaffScheduleInput>) => {
    try {
      const result = GetStaffScheduleInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const staffSchedule = await getStaffSchedule(result.data.staffId);

      return {
        data: staffSchedule ?? null, // Return null if no schedule is found
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

// Define the input schema for listing staff schedules
const ListStaffSchedulesInput = z.object({
  page: z.number().catch(1),
  pageSize: z.number().catch(50),
  week: z.string().optional(),
  role: z.string().optional(),
});

export const $listStaffSchedules = createServerFn(
  "GET",
  async (input: z.input<typeof ListStaffSchedulesInput>) => {
    try {
      const result = ListStaffSchedulesInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const staffSchedules = await findStaffSchedules(result.data);

      return {
        data: staffSchedules ?? [],
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
