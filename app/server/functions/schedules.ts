import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { getScheduleById } from "@/server/db/queries/schedule/read";

// Define the input schema
const GetScheduleByIdInput = z.object({
  scheduleId: z.string().min(1, "Schedule ID is required"),
});

export const $getScheduleById = createServerFn(
  "GET",
  async (input: z.input<typeof GetScheduleByIdInput>) => {
    try {
      const result = GetScheduleByIdInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const schedule = await getScheduleById(result.data.scheduleId);

      return {
        data: schedule ?? null, // the result from the query function returns undefined if no data is found, we need to that to be translated to null
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
