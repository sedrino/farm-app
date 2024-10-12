import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { findTags } from "@/server/db/queries/tag/read";

// Define the input schema
const ListTagsInput = z.object({});

export const $listTags = createServerFn(
  "GET",
  async (input: z.input<typeof ListTagsInput>) => {
    try {
      const result = ListTagsInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const tags = await findTags();

      return {
        data: tags ?? [], // Return an empty array if no tags are found
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
