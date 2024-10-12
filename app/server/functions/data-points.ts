import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { findDataPoints } from "@/server/db/queries/data-point/read";

// Define the input schema
const ListDataPointsInput = z.object({});

export const $listDataPoints = createServerFn(
  "GET",
  async (input: z.input<typeof ListDataPointsInput>) => {
    try {
      const result = ListDataPointsInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const dataPoints = await findDataPoints();

      return {
        data: dataPoints ?? [], // Return an empty array if no data points are found
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
