import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { findParticipants } from "@/server/db/queries/participant/read";

// Define the input schema
const ListParticipantsInput = z.object({});

export const $listParticipants = createServerFn(
  "GET",
  async (input: z.input<typeof ListParticipantsInput>) => {
    try {
      const result = ListParticipantsInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const participants = await findParticipants();

      return {
        data: participants ?? [], // Return an empty array if no participants are found
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
