import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { findHealthRecords } from "@/server/db/queries/health-record/read";

// Define the input schema
const ListHealthRecordsInput = z.object({
  horseId: z.string().min(1, "Horse ID is required"),
});

export const $listHealthRecords = createServerFn(
  "GET",
  async (input: z.input<typeof ListHealthRecordsInput>) => {
    try {
      const result = ListHealthRecordsInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const healthRecords = await findHealthRecords(result.data.horseId);

      return {
        data: healthRecords ?? [], // Return an empty array if no records are found
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
