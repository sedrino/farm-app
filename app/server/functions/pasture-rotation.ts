import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  addPastureRotation,
  startNewRotation,
} from "@/server/db/queries/pasture-rotation/write";

// Define the input schema
const CreatePastureRotationInput = z.object({
  rotation: z.object({
    pastureId: z.string().min(1, "Pasture is required"),
    horseIds: z.array(z.string()).min(1, "At least one horse is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
  }),
});

export const $createPastureRotation = createServerFn(
  "POST",
  async (input: z.input<typeof CreatePastureRotationInput>) => {
    try {
      const result = CreatePastureRotationInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const pastureRotation = await addPastureRotation(result.data.rotation);

      return {
        pastureRotation,
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
const StartNewRotationInput = z.object({
  rotation: z.object({
    pastureId: z.string().min(1, "Pasture ID is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
  }),
});

export const $startNewRotation = createServerFn(
  "POST",
  async (input: z.input<typeof StartNewRotationInput>) => {
    try {
      const result = StartNewRotationInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const rotation = await startNewRotation(result.data.rotation);

      return {
        rotation,
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
