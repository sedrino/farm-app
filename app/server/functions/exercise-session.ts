import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { deleteExerciseSession } from "@/server/db/queries/exercise-session/write";

// Define the input schema
const DeleteExerciseSessionInput = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
});

export const $deleteExerciseSession = createServerFn(
  "POST",
  async (input: z.input<typeof DeleteExerciseSessionInput>) => {
    try {
      const result = DeleteExerciseSessionInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      await deleteExerciseSession(result.data.sessionId);

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
