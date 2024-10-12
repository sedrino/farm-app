import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  addFeedingSchedule,
  deleteFeedingSchedule,
} from "@/server/db/queries/feeding-schedule/write";

// Define the input schema
const CreateFeedingScheduleInput = z.object({
  horseId: z.string().min(1, "Horse is required"),
  feedingTime: z.string().min(1, "Feeding time is required"),
  feedType: z.string().min(1, "Feed type is required"),
  quantity: z.number().min(1, "Quantity is required"),
  isRecurring: z.boolean().optional(),
  recurrencePattern: z.string().optional(),
  notes: z.string().optional(),
});

export const $createFeedingSchedule = createServerFn(
  "POST",
  async (input: z.input<typeof CreateFeedingScheduleInput>) => {
    try {
      const result = CreateFeedingScheduleInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const feedingSchedule = await addFeedingSchedule(result.data);

      return {
        feedingSchedule,
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
const DeleteFeedingScheduleInput = z.object({
  scheduleId: z.string().min(1, "Schedule ID is required"),
});

export const $deleteFeedingSchedule = createServerFn(
  "POST",
  async (input: z.input<typeof DeleteFeedingScheduleInput>) => {
    try {
      const result = DeleteFeedingScheduleInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      await deleteFeedingSchedule(result.data.scheduleId);

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
