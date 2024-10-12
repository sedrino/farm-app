import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { findFeedTypes } from "@/server/db/queries/feed-type/read";

// Define the input schema
const ListFeedTypesInput = z.object({});

export const $listFeedTypes = createServerFn(
  "GET",
  async (input: z.input<typeof ListFeedTypesInput>) => {
    try {
      const result = ListFeedTypesInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const feedTypes = await findFeedTypes();

      return {
        data: feedTypes ?? [], // Return an empty array if no feed types are found
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
