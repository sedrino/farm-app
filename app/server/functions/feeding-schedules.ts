import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { findFeedingSchedules } from "@/server/db/queries/feeding-schedule/read";

// Define the input schema
const ListFeedingSchedulesInput = z.object({
  horseId: z.string().min(1, "Horse ID is required"),
  page: z.number().min(1).catch(1),
  pageSize: z.number().min(1).catch(10),
  search: z.string().optional(),
  sort: z.enum(["time", "date"]).catch("time"),
});

export const $listFeedingSchedules = createServerFn(
  "GET",
  async (input: z.input<typeof ListFeedingSchedulesInput>) => {
    try {
      const result = ListFeedingSchedulesInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const feedingSchedules = await findFeedingSchedules(result.data);

      return {
        data: feedingSchedules ?? [],
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
