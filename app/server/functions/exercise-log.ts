import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  addExerciseLog,
  deleteExerciseLog,
} from "@/server/db/queries/exercise-log/write";

// Define the input schema
const CreateExerciseLogInput = z.object({
  horseId: z.string().min(1, "Horse ID is required"),
  exerciseLog: z.object({
    date: z.number().min(1, "Date is required"),
    startTime: z.number().min(1, "Start time is required"),
    endTime: z.number().min(1, "End time is required"),
    type: z.string().min(1, "Type of exercise is required"),
    intensity: z.string().min(1, "Intensity level is required"),
    trainer: z.string().min(1, "Trainer name is required"),
    notes: z.string().optional(),
  }),
  goals: z.array(z.string()).default([]).optional(),
  achievements: z.array(z.string()).default([]).optional(),
  horseBehavior: z.string().optional(),
  areasForImprovement: z.string().optional(),
  mediaUrls: z.array(z.string()).default([]).optional(),
});

export const $createExerciseLog = createServerFn(
  "POST",
  async (input: z.input<typeof CreateExerciseLogInput>) => {
    try {
      const result = CreateExerciseLogInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const exerciseLog = await addExerciseLog(result.data);

      return {
        exerciseLog,
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
const DeleteExerciseLogInput = z.object({
  exerciseLogId: z.string().min(1, "Exercise Log ID is required"),
});

export const $deleteExerciseLog = createServerFn(
  "POST",
  async (input: z.input<typeof DeleteExerciseLogInput>) => {
    try {
      const result = DeleteExerciseLogInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      await deleteExerciseLog(result.data.exerciseLogId);

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
