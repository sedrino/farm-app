import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  findExerciseSessionsCount,
  findExerciseSessionsPaginated,
} from "@/server/db/queries/exercise-session/read";

// Define the input schema
const ListExerciseSessionsInput = z.object({
  page: z.number().min(1).catch(1),
  pageSize: z.number().min(1).catch(50),
  horseId: z.string().optional(),
  exerciseTypeId: z.string().optional(),
  trainerId: z.string().optional(),
  dateRange: z.string().optional(),
});

export const $listExerciseSessions = createServerFn(
  "GET",
  async (input: z.input<typeof ListExerciseSessionsInput>) => {
    try {
      const result = ListExerciseSessionsInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const exerciseSessions = await findExerciseSessionsPaginated(result.data);
      const exerciseSessionsCount = await findExerciseSessionsCount({
        horseId: result.data.horseId,
        exerciseTypeId: result.data.exerciseTypeId,
        trainerId: result.data.trainerId,
        dateRange: result.data.dateRange,
      });

      return {
        data: exerciseSessions,
        totalSessions: exerciseSessionsCount,
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
