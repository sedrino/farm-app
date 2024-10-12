import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { findEventTypes } from "@/server/db/queries/event-type/read";

// Define the input schema
const ListEventTypesInput = z.object({});

export const $listEventTypes = createServerFn(
  "GET",
  async (input: z.input<typeof ListEventTypesInput>) => {
    try {
      const result = ListEventTypesInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const eventTypes = await findEventTypes();

      return {
        data: eventTypes ?? [], // Return an empty array if no event types are found
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
