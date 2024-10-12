import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { findOwners } from "@/server/db/queries/owner/read";

// Define the input schema
const ListOwnersInput = z.object({});

export const $listOwners = createServerFn(
  "GET",
  async (input: z.input<typeof ListOwnersInput>) => {
    try {
      const result = ListOwnersInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const owners = await findOwners();

      return {
        data: owners ?? [], // Return an empty array if no owners are found
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
