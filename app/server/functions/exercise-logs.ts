import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { findExerciseLogs } from "@/server/db/queries/exercise-log/read";

// Define the input schema
const ListExerciseLogsInput = z.object({
  horseId: z.string().min(1, "Horse ID is required"),
  page: z.number().optional(),
  pageSize: z.number().optional(),
});

export const $listExerciseLogs = createServerFn(
  "GET",
  async (input: z.input<typeof ListExerciseLogsInput>) => {
    try {
      const result = ListExerciseLogsInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const exerciseLogs = await findExerciseLogs(result.data);

      return {
        data: exerciseLogs ?? [],
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
