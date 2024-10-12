import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { findExerciseReports } from "@/server/db/queries/exercise-report/read";

// Define the input schema
const ListExerciseReportsInput = z.object({
  page: z.number().min(1).catch(1),
  pageSize: z.number().min(1).catch(10),
  search: z.string().optional(),
  sort: z.enum(["date", "horse", "type"]).catch("date"),
});

export const $listExerciseReports = createServerFn(
  "GET",
  async (input: z.input<typeof ListExerciseReportsInput>) => {
    try {
      const result = ListExerciseReportsInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const exerciseReports = await findExerciseReports(result.data);

      return {
        data: exerciseReports ?? [],
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
