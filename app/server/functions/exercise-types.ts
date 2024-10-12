import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { findExerciseTypes } from "@/server/db/queries/exercise-type/read";

// Define the input schema
const ListExerciseTypesInput = z.object({});

export const $listExerciseTypes = createServerFn(
  "GET",
  async (input: z.input<typeof ListExerciseTypesInput>) => {
    try {
      const result = ListExerciseTypesInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const exerciseTypes = await findExerciseTypes();

      return {
        data: exerciseTypes ?? [], // Return an empty array if no data is found
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
