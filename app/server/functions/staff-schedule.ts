import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { addStaffSchedule } from "@/server/db/queries/staff-schedule/write";

// Define the input schema
const CreateStaffScheduleInput = z.object({
  staffId: z.string().min(1, "Staff ID is required"),
  shifts: z
    .array(
      z.object({
        date: z.string().min(1, "Date is required"),
        startTime: z.string().min(1, "Start time is required"),
        endTime: z.string().min(1, "End time is required"),
        task: z.string().min(1, "Task is required"),
      })
    )
    .min(1, "At least one shift is required"),
});

export const $createStaffSchedule = createServerFn(
  "POST",
  async (input: z.input<typeof CreateStaffScheduleInput>) => {
    try {
      const result = CreateStaffScheduleInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const { staffId, shifts } = result.data;
      const staffSchedule = await addStaffSchedule({ staffId, shifts });

      return {
        staffSchedule,
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
