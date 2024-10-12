import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { deleteExerciseReport } from "@/server/db/queries/exercise-report/write";

// Define the input schema
const DeleteExerciseReportInput = z.object({
  reportId: z.string().min(1, "Report ID is required"),
});

export const $deleteExerciseReport = createServerFn(
  "POST",
  async (input: z.input<typeof DeleteExerciseReportInput>) => {
    try {
      const result = DeleteExerciseReportInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      await deleteExerciseReport(result.data.reportId);

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
