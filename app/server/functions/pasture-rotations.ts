import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { findPastureRotations } from "@/server/db/queries/pasture-rotation/read";

// Define the input schema
const ListPastureRotationsInput = z.object({});

export const $listPastureRotations = createServerFn(
  "GET",
  async (input: z.input<typeof ListPastureRotationsInput>) => {
    try {
      const result = ListPastureRotationsInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const pastureRotations = await findPastureRotations();

      return {
        data: pastureRotations ?? [], // Return an empty array if no data is found
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
