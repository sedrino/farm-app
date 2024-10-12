import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { assignHorseToStall } from "@/server/db/queries/stall-assignment/write";

// Define the input schema
const AssignHorseInput = z.object({
  stallId: z.string().min(1, "Stall ID is required"),
  horseId: z.string().min(1, "Horse is required"),
  startDate: z.string().min(1, "Start date is required"),
  expectedDuration: z.string().min(1, "Expected duration is required"),
  notes: z.string().optional(),
});

export const $assignHorse = createServerFn(
  "POST",
  async (input: z.input<typeof AssignHorseInput>) => {
    try {
      const result = AssignHorseInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const assignment = await assignHorseToStall(result.data);

      return {
        assignment,
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
