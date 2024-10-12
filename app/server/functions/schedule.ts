import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  addSchedule,
  editSchedule,
  updateSchedule,
} from "@/server/db/queries/schedule/write";

// Define the input schema
const CreateScheduleInput = z.object({
  schedule: z.object({
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    shiftTimes: z.array(
      z.object({
        shiftStart: z.string().min(1, "Shift start time is required"),
        shiftEnd: z.string().min(1, "Shift end time is required"),
        staffId: z.string().min(1, "Staff member is required"),
      })
    ),
  }),
  repeatPattern: z.enum(["none", "weekly", "bi-weekly"]).default("none"),
});

export const $createSchedule = createServerFn(
  "POST",
  async (input: z.input<typeof CreateScheduleInput>) => {
    try {
      const result = CreateScheduleInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const schedule = await addSchedule(result.data);

      return {
        schedule,
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
const EditScheduleInput = z.object({
  scheduleId: z.string().min(1, "Schedule ID is required"),
  schedule: z.object({
    title: z.string().min(1, "Title is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    date: z.string().min(1, "Date is required"),
    description: z.string().optional(),
    location: z.string().optional(),
    isAllDay: z.boolean().optional(),
    attendees: z.array(z.string()).optional(),
  }),
});

export const $editSchedule = createServerFn(
  "POST",
  async (input: z.input<typeof EditScheduleInput>) => {
    try {
      const result = EditScheduleInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const updatedSchedule = await editSchedule(result.data);

      return {
        schedule: updatedSchedule,
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
const UpdateScheduleInput = z.object({
  scheduleId: z.string().min(1, "Schedule ID is required"),
  schedule: z.object({
    name: z.string().min(1, "Schedule name is required"),
    startDate: z.number().min(1, "Start date is required"),
    endDate: z.number().min(1, "End date is required"),
    status: z.string().min(1, "Status is required"),
  }),
  shifts: z
    .array(
      z.object({
        staffId: z.string().min(1, "Staff member is required"),
        startTime: z.number().min(1, "Start time is required"),
        endTime: z.number().min(1, "End time is required"),
      })
    )
    .min(1, "At least one shift is required"),
});

export const $updateSchedule = createServerFn(
  "POST",
  async (input: z.input<typeof UpdateScheduleInput>) => {
    try {
      const result = UpdateScheduleInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const updatedSchedule = await updateSchedule(result.data);

      return {
        schedule: updatedSchedule,
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
